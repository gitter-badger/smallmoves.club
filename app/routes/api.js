var helpers = require('../helpers');
var Member = require('../models/member');

var express = require('express');
var router = express.Router();

router.get('/members.json', function (request, response) {
	Member.find(function(err, members) {
	    if (err)
	        response.send(err);

	    // TODO: Whitelist fields
	    response.json(members);
	});
});

router.post('/joined_slack', function (request, response) {
	if(helpers.api_authenticated(request.body.api_key))
		if(request.body.email)
			Member.findOne({ email: request.body.email }).exec(function (err, member) {
				if(err)
					response.status(500).json({ error: 'Error running query: ' + err });
				else if(member) {
					member.joined_slack = true;
					member.save();

					response.status(200).json({ message: 'Member join status updated' });
				} else
					response.status(404).json({ error: 'Unknown member' });
			});
		else
			response.status(400).json({ error: 'Missing parameter (email)' });
	else
		response.status(403).json({ error: 'Invalid API key' });
});

module.exports = router;