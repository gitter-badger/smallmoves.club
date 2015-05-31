var config = require('./config.js');

var GoogleSpreadsheet = require("edit-google-spreadsheet");
var mcapi = require('mailchimp-api');
var request = require('request');
var mandrill = require('mandrill-api/mandrill');
var moment = require('moment');
var Member = require("./models/member");

exports.logMember = function(data) {
	GoogleSpreadsheet.load({
			debug: true,
			spreadsheetId: config.google.spreadsheet_id,
			worksheetId: config.google.worksheet_id,

			oauth: {
				email: config.google.service_account,
				keyFile: config.google.keyfile
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
	mc = new mcapi.Mailchimp(config.mailchimp.api_key);

	var mcData = {
    	id: config.mailchimp.list_id,
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
	request.post({url: 'https://' + config.slack.team_name + '.slack.com/api/users.admin.invite',
	              formData: {
	              	token: config.slack.api_token,
	         		email: data.email
	              }
	             }, function (error, response, body) {
				 	console.log('Slack invite sent to ' + data.email + ' (' + error + ')');
	             });
};

exports.notifySignup = function(data) {
	var mandrill_client = new mandrill.Mandrill(config.mailchimp.mandrill_api_key);

	var template_content = [{
        "name": data.name,
        "email": data.email
    }];
	var message = {
	    "subject": "New " + config.community_name + " signup from " + data.name,
	    "from_email": config.contact_email,
	    "from_name": config.community_name,
	    "to": [{
	            "email": config.signups_notification_email,
	            "name": "Recipient Name",
	            "type": "to"
	        }],
	    "headers": {
	        "Reply-To": config.contact_email
	    },
	    "tags": [
	        "signup"
	    ]};

	// TODO: Fix template content injection
	mandrill_client.messages.sendTemplate({"template_name": config.mailchimp.mandrill_template, "template_content": template_content, "message": message}, function(result) {
	    console.log(result);
	}, function(e) {
	    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	});
};

exports.signupAnnounce = function(data) {
	request.post({url: config.slack.incoming_webhook,
	              body: JSON.stringify({
              		     	text: data.name + " just signed up to Small Moves!",
              		     	channel: config.slack.signups_channel
		              	})
	             }, function (error, response, body) {
				 	console.log('Signup announcement sent to ' + config.slack.signups_channel + ' (' + body + ')');
	             });

};