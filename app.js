var express = require('express');
var bodyParser  = require('body-parser');
var config = require('./config.json')
var tasks = require('./signup-tasks');
var Member = require("./app/models/member");

var app = express();

app.set('port', process.env.PORT || 8001);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/signup', function(request, response) {
	request.body.name = request.body.first_name + " " + request.body.last_name;

	if(typeof config['RUN_TASKS'] != 'undefined' && config['RUN_TASKS'] == true) {
		tasks.logMember(request.body);
		if(request.body.newsletter == 'on')
			tasks.newsletterSubscribe(request.body);
		tasks.slackInvite(request.body);
		tasks.notifySignup(request.body);
		tasks.signupAnnounce(request.body);
	}

	response.statusCode = 302;
	response.setHeader("Location", '/thanks.html');
	response.end();
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