process.env.NODE_ENV = 'test';

var chai      = require('chai'),
    plugin    = require("chai-jq"),
   	request   = require('request'),
   	supertest = require('supertest'),
	server    = require('../app/main.js');

var Member  = require('../app/models/member.js'),
    config  = require('../app/config.js'),
    port    = config.port || 8001,
    baseurl = 'http://localhost:' + port;

chai.use(plugin);
var expect = chai.expect;

describe('Server', function () {
	before(function (done) {
		console.log('    Starting the server');

		var member = new Member({
				first_name: 'Bob',
				last_name: 'Test',
				email: 'hello@smallmoves.club',
				newsletter: true
			});

		member.save(function(err) {
			if (err)
				done(err);
			else
				done();
		});
	});

	after(function (done) {
		Member.remove({}, function(err) {
			console.log('    Stopping the server');
			server.close();
			done();
		});
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

describe('Test the API', function () {
	it('Responds with members list', function(done){
		supertest(server)
		.get('/api/members.json')
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(200, done);
	});

		it('Responds with valid, indvidual member info', function (done) {
			supertest(server)
				.get('/api/member/hello@smallmoves.club')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});

		it('Responds with an error for unknown member', function (done) {
			supertest(server)
				.get('/api/member/unknown@smallmoves.club')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(404, done);
		});
	});
});