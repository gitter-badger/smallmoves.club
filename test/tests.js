process.env.NODE_ENV = 'test';

var chai      = require('chai'),
    cheerio   = require("cheerio"),
   	request   = require('request'),
   	supertest = require('supertest'),
	server    = require('../app/main.js');

var Member  = require('../app/models/member.js'),
    config  = require('../app/config.js'),
    port    = config.port || 8001,
    baseurl = 'http://localhost:' + port;

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

		it('Shows the right member count', function (done) {
			request.get({ url: baseurl + '/' }, function (error, response, body) {
				var $ = cheerio.load(body);

	            expect($('#membercount').html()).to.be.equal('1');

	            done();
	        });
		});
	});

	describe('Test the API', function () {
		it('Responds with members list', function (done){
			supertest(server)
			.get('/api/members')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200, done);
		});

		it('Responds with valid, indvidual member info', function (done) {
			supertest(server)
				.get('/api/members/hello@smallmoves.club')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});

		it('Responds with an error for unknown member', function (done) {
			supertest(server)
				.get('/api/members/unknown@smallmoves.club')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(404, done);
		});

		it('Requires API key to update a member', function (done) {
			request.patch({ url: baseurl + '/api/members/hello@smallmoves.club', form: { twitter: 'smallmovesclub' } }, function (err, response, body) {
				if(err)
					done(err);
				else {
					expect(response.statusCode).to.be.equal(403);

					done();
				}
			});
		});

		it('Updates a member', function (done) {
			request.patch({ url: baseurl + '/api/members/hello@smallmoves.club', form: { api_key: config.api_key, twitter: 'smallmovesclub' } }, function (err, response, body) {
				request.get({ url: baseurl + '/api/members/hello@smallmoves.club' }, function (err, response, body) {
					if(err)
						done(err);						
					else {
						member = JSON.parse(response.body);
						expect(member).to.exist;
						expect(member.twitter).to.equal('smallmovesclub');

						done();
					}
				});
			});
		});
	});
});