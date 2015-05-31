var config = require('./config.js');

exports.run_signup_task = function(task_id) {
	if(typeof config.signup_tasks == 'undefined')
		return true;
	else
		return config.signup_tasks == 'all' ||
	    	   config.signup_tasks.indexOf('all') >= 0 ||
		       config.signup_tasks.indexOf(task_id) >= 0; 
};

exports.api_authenticated = function(api_key) {
	return api_key && config.api.api_keys.indexOf(api_key) >= 0;
};