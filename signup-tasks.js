var config = require('./config.json')

var GoogleSpreadsheet = require("edit-google-spreadsheet");
var mcapi = require('mailchimp-api');
var request = require('request');
var mandrill = require('mandrill-api/mandrill');
var moment = require('moment');
var Member = require("./app/models/member");

exports.logMember = function(data) {
	GoogleSpreadsheet.load({
			debug: true,
			spreadsheetId: config['SPREADSHEET_ID'],
			worksheetId: config['WORKSHEET_ID'],

			oauth: {
				email: config['GOOGLE_SERVICE_ACCOUNT'],
				keyFile: config['GOOGLE_KEYFILE']
			}
		},

		function sheetReady(err, spreadsheet) {
			if(err) throw err;
			spreadsheet.receive(function(err, rows, info) {
				if(err) throw err;

				var join_date = moment().format('llll');
				var lastRow = info.lastRow;
				var update = {};
				update[lastRow + 1] = {1: data.name, 2: data.email, 3: data.newsletter, 5: join_date, 6: data.goal};

				spreadsheet.add(update);
				spreadsheet.send(function(err) {
					if(err) throw err;
				});
			});
		});

	var member = new Member({
		first_name: data.first_name,
		last_name: data.last_name,
		email: data.email,
		newsletter: data.newsletter,
		goal: data.goal
	});

	member.save(function(err) {
		if (err) throw err;

		console.log('Member saved successfully to the database.');
	});
};

exports.newsletterSubscribe = function(data) {
	mc = new mcapi.Mailchimp(config['MAILCHIMP_API_KEY']);

	var mcData = {
    	id: config['MAILCHIMP_LIST_ID'],
    	email: { email: data.email },
    	merge_vars: {
    		EMAIL: data.email,
    		FNAME: data.first_name,
    		LNAME: data.last_name
    	}
    };

    mc.lists.subscribe(mcData, function(data) {
        console.log("Newsletter subscription succeeded." + JSON.stringify(data));
	}, function(error) {
    	console.log("Newsletter subscription failed: " + error);
	});
};

exports.slackInvite = function(data) {
	request.post({url: 'https://smallmoves.slack.com/api/users.admin.invite',
	              formData: {
	              	token: config['SLACK_API_TOKEN'],
	         		email: data.email
	              }
	             }, function (error, response, body) {
				 	console.log('Slack invite sent to ' + data.email + ' (' + error + ')');
	             });
};

exports.notifySignup = function(data) {
	var mandrill_client = new mandrill.Mandrill(config['MANDRILL_API_KEY']);

	var template_name = "small-moves-join-transactional";
	var template_content = [{
        "name": data.name,
        "email": data.email
    }];
	var message = {
	    "html": "<p>Example HTML content</p>",
	    "text": "Example text content",
	    "subject": "New Small Moves Signup from " + data.name,
	    "from_email": "no-reply@smallmoves.club",
	    "from_name": "Small Moves Club",
	    "to": [{
	            "email": config['SIGNUPS_NOTIFICATION_EMAIL'],
	            "name": "Recipient Name",
	            "type": "to"
	        }],
	    "headers": {
	        "Reply-To": "hello@smallmoves.club"
	    },
	    "tags": [
	        "signup"
	    ]	};

	mandrill_client.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message}, function(result) {
	    console.log(result);
	}, function(e) {
	    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	});
};

exports.signupAnnounce = function(data) {
	request.post({url: config['SIGNUPS_WEBHOOK'],
	              body: JSON.stringify({
              		     	text: data.name + " just signed up to Small Moves!",
              		     	channel: config['SIGNUPS_CHANNEL'],
              			  	username: "smallbot",
              		     	icon_url: "https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2015-05-17/4943857629_7d41bc45de2198efa81e_72.jpg"
		              	})
	             }, function (error, response, body) {
				 	console.log('Signup announcement sent to ' + config['SIGNUPS_CHANNEL'] + ' (' + body + ')');
	             });

}