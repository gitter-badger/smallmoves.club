var chai    = require('chai'),
    plugin  = require("chai-jq"),
   	request = require('request'),
	server  = require('../app/main.js');

var config  = require('../app/config.js'),
    port    = config.port || 8001;
var baseurl = 'http://localhost:' + port;

chai.use(plugin);
var expect = chai.expect;

describe('server', function () {
	before(function (done) {
			console.log('Starting the server');
			done();
	});

	after(function (done) {
			console.log('Stopping the server');
			server.close();
			done();
	});

	describe('Test the home page', function () {
		it('Loads the right title', function (done) {
			request.get({ url: baseurl + '/' }, function (error, response, body) {
				expect(body).to.include('A motivational community to celebrate little victories');
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.equal('text/html; charset=utf-8');
				done();
			});
		});
	});
});