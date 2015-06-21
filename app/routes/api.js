var helpers   = require('../helpers'),
    Member    = require('../models/member'),
    config    = require('../config.js'),

    Whitelist = require('whitelist'),
    express   = require('express'),
    cors      = require('cors'),
    router    = express.Router();

router.use(cors());

router.use(function(request, response, next) {
	api_key = request.query.api_key || request.body.api_key;

	if(config.api.auth_whitelist[request.method] &&
	   config.api.auth_whitelist[request.method].indexOf(request.path.replace(/^\/([^\/]*).*$/, '$1')) > -1)
		next();
	else {
		if(helpers.api_authenticated(api_key))
			next();
		else
			response.status(403).json({ error: 'Invalid API key' });
	}
});

router.get('/members/', Whitelist.middleware(config.api.member_whitelist), function (request, response) {
	Member.find(function(err, members) {
	    if (err)
	        response.status(500).send({ error: 'Error running query: ' + err});
	    else
	    	response.json(members);
	});
});

router.get('/members/:id', Whitelist.middleware(config.api.member_whitelist), function (request, response) {
	Member.findOne({ $or: [{ email: request.params.id }, { slack_user_id: request.params.id } ]}, function (err, member) {
		if(err)
			response.status(500).json({ error: 'Error running query: ' + err });
		else if(member) {
			response.status(200).json(member);
		} else
			response.status(404).json({ error: 'Unknown member' });
	});
});

router.patch('/members/:id', function(request, response) {
	Member.findOneAndUpdate({ $or: [{ slack_user_id: request.params.id }, { email: request.params.id }] }, request.body, function(err, row) {
		if(err)
			response.send(err);
		else if(row)
			response.json({ status: 'OK' });
		else
			response.status(404).json({ error: 'Unknown member' });
	});
});

router.get('/unsub', function(request, response) {
	response.json({ status: 'OK' });
});

router.post('/unsub', function(request, response) {
	var body = request.body;

	if(body.type && body.type == 'unsubscribe')
		Member.findOneAndUpdate({ email: body.data.email }, { newsletter: false, newsletter_unsubscribed: true }, function (err, row) {
			if(err)
				response.send(err);
			else
				response.json({ status: 'OK' });
		});
	else
		response.json({ message: 'Skipping unhandled event type'});
});

module.exports = router;