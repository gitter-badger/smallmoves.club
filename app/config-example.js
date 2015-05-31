module.exports = {
	community_name: '',
	contact_email: '',
	signup_tasks: ['all'],
	signups_notification_email: '',
	mongodb_url: '',

	api: {
		api_keys: [],
		member_whitelist: 'first_name last_name email newsletter twitter signup_date joined_slack joined_slack_date'
	},

	/* Third party services */
	google: {
		service_account: '',
		keyfile: '',
		spreadsheet_id: '',
		worksheet_id: ''
	},
	mailchimp: {
		api_key: '',
		list_id: '',
		mandrill_api_key: '',
		mandrill_template: ''
	},
	slack: {
		team_name: '',
		api_token: '',
		incoming_webhook: '',
		signups_channel: 'test'
	}
};
