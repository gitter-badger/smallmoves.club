var config = require('./config.json');

exports.run_signup_task = function(task_id) {
	if(typeof config.SIGNUP_TASKS == 'undefined')
		return true;
	else
		return config.SIGNUP_TASKS == 'all' ||
	    	   config.SIGNUP_TASKS.indexOf('all') >= 0 ||
		       config.SIGNUP_TASKS.indexOf(task_id) >= 0; 
};

exports.api_authenticated = function(api_key) {
	return api_key && config.API_KEYS.indexOf(api_key) >= 0;
};