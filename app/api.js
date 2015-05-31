var helpers = require('../helpers');

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
		response.json({ message: 'Got valid API key' });
	else
		response.status(403).json({ error: 'Invalid API key' });
});

module.exports = router;