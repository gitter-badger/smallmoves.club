var express = require('express');
var hbs = require('express-hbs');
var bodyParser  = require('body-parser');
var config = require('./config.json');
var tasks = require('./signup-tasks');
var Member = require("./models/member");

var app = express();

// Helper to selectively run some tasks during development
function run_signup_task(task_id) {
	if(typeof config.SIGNUP_TASKS == 'undefined')
		return true;
	else
		return config.SIGNUP_TASKS == 'all' ||
	    	   config.SIGNUP_TASKS.indexOf('all') >= 0 ||
		       config.SIGNUP_TASKS.indexOf(task_id) >= 0; 
}

// Set up handlebars template engine
app.engine('html', hbs.express4({ extname: '.html', layoutsDir: __dirname + '/views/layouts' }));
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.set('port', process.env.PORT || 8001);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (request, response) {
	Member.count({ "joined_slack": true }, function (err, count) {
	    response.render('home', { headerClass: "alt reveal", memberCount: count });
	});
});

app.post('/signup', function(request, response) {
	request.body.email = request.body.email.trim();
	request.body.first_name = request.body.first_name.trim();
	request.body.last_name = request.body.last_name.trim();
	request.body.name = request.body.first_name + " " + request.body.last_name;

	if(run_signup_task('log_member'))
		tasks.logMember(request.body);
	if(run_signup_task('slack_invite'))
		tasks.slackInvite(request.body);
	if(run_signup_task('notify_signup'))
		tasks.notifySignup(request.body);
	if(run_signup_task('signup_announce'))
		tasks.signupAnnounce(request.body);
	if(run_signup_task('newsletter_subscribe') && request.body.newsletter == 'on')
		tasks.newsletterSubscribe(request.body);

	response.render('thanks');
});

app.get('/api/members.json', function (request, response) {
	Member.find(function(err, members) {
	    if (err)
	        response.send(err);

	    // TODO: Whitelist fields
	    response.json(members);
	});
});

app.listen(app.get('port'), function() {
	console.log('Listening on port ' + app.get('port') + '... (' + process.env.NODE_ENV + ')');
});