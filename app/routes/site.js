var helpers = require('../helpers');
var tasks = require('../signup-tasks');
var Member = require('../models/member');

var express = require('express');
var router = express.Router();

router.get('/', function (request, response) {
	Member.count({ "joined_slack": true }, function (err, count) {
	    response.render('home', { headerClass: "alt reveal", memberCount: count });
	});
});

router.post('/signup', function(request, response) {
	request.body.email = request.body.email.trim();
	request.body.first_name = request.body.first_name.trim();
	request.body.last_name = request.body.last_name.trim();
	request.body.name = request.body.first_name + " " + request.body.last_name;

	if(helpers.run_signup_task('log_member'))
		tasks.logMember(request.body);
	if(helpers.run_signup_task('slack_invite'))
		tasks.slackInvite(request.body);
	if(helpers.run_signup_task('notify_signup'))
		tasks.notifySignup(request.body);
	if(helpers.run_signup_task('signup_announce'))
		tasks.signupAnnounce(request.body);
	if(helpers.run_signup_task('newsletter_subscribe') && request.body.newsletter == 'on')
		tasks.newsletterSubscribe(request.body);

	response.render('thanks');
});

module.exports = router;
