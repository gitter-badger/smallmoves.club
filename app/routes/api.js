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

module.exports = router;