config = require('./app/config.json');

function run_signup_task(task_id) {
	if(typeof config.SIGNUP_TASKS == 'undefined')
		return true;
	else
		return config.SIGNUP_TASKS == 'all' ||
	    	   config.SIGNUP_TASKS.indexOf('all') >= 0 ||
		       config.SIGNUP_TASKS.indexOf(task_id) >= 0; 
}

run_signup_task('foo') && console.log('Run foo...');
