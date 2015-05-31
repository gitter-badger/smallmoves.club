var helpers = require('../helpers');
var Member = require('../models/member');
var config = require('../config.js');

var	Whitelist = require('whitelist');
var express = require('express');
var router = express.Router();

router.get('/members.json', Whitelist.middleware(config.api.member_whitelist), function (request, response) {
	Member.find(function(err, members) {
	    if (err)
	        response.status(500).send({ error: 'Error running query: ' + err});
	    else
	    	response.json(members);
	});
});

router.get('/member/:email', Whitelist.middleware(config.api.member_whitelist), function (request, response) {
	Member.findOne({ email: request.params.email }).exec(function (err, member) {
		if(err)
			response.status(500).json({ error: 'Error running query: ' + err });
		else if(member) {
			response.status(200).json(member);
		} else
			response.status(404).json({ error: 'Unknown member' });
	});
});

router.post('/joined_slack', function (request, response) {
	if(helpers.api_authenticated(request.body.api_key))
		if(request.body.email)
			Member.findOne({ email: request.body.email }).exec(function (err, member) {
				if(err)
					response.status(500).json({ error: 'Error running query: ' + err });
				else if(member) {
					if(member.joined_slack)
						response.status(400).json({ error: 'Member already marked as joined' });
					else {
						member.joined_slack = true;
						member.joined_slack_date = Date.now();
						member.save();

						response.status(200).json({ message: 'Member marked as joined' });
					}
				} else
					response.status(404).json({ error: 'Unknown member' });
			});
		else
			response.status(400).json({ error: 'Missing parameter (email)' });
	else
		response.status(403).json({ error: 'Invalid API key' });
});

module.exports = router;