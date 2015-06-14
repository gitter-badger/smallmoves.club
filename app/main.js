var express     = require('express'),
    hbs         = require('express-hbs'),
    bodyParser  = require('body-parser'),
    helpers     = require('./helpers'),
    morgan      = require('morgan');

var app = express();

if(app.get('env') == 'dev')
	app.use(morgan('dev'));

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

var server = app.listen(app.get('port'), function() {
	console.log('Listening on port ' + app.get('port') + '... (' + app.get('env') + ')');
});

module.exports = server;