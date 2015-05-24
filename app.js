var express = require('express');
var bodyParser  = require('body-parser');
var config = require('./config.json')
var tasks = require('./signup-tasks');

var app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/signup', function(request, response) {
	if(typeof config['RUN_TASKS'] != 'undefined' && config['RUN_TASKS'] == true) {
		tasks.logMember(request.body);
		if(request.body.newsletter == 'on')
			tasks.newsletterSubscribe(request.body);
		tasks.slackInvite(request.body);
		tasks.notifySignup(request.body);		
	}

	response.statusCode = 302;
	response.setHeader("Location", '/thanks.html');
	response.end();
});

app.listen(3000, function() {
	console.log('Listening...');
});