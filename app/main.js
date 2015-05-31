var express = require('express');
var hbs = require('express-hbs');
var bodyParser  = require('body-parser');
var helpers = require('./helpers');

var app = express();

// Set up handlebars template engine
app.engine('html', hbs.express4({ extname: '.html', layoutsDir: __dirname + '/views/layouts' }));
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.set('port', process.env.PORT || 8001);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', require("./routes/api.js"));
app.use('/', require("./routes/site.js"));

app.listen(app.get('port'), function() {
	console.log('Listening on port ' + app.get('port') + '... (' + process.env.NODE_ENV + ')');
});