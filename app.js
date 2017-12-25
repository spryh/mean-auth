var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var session = require('express-session')
var app = express();

// Use SESSIONS for tracking logins
// secret signs the sessionID cookie
// don't save uninitialized sessions
// THIS MUST BE BEFORE EVERYTHING!!!

app.use(session({
  secret: 'treehouse loves you',
  resave: true,
  saveUninitialized: false
}))

// Make user ID available to all view templates via res.locals
app.use((req, res, next)=>{
  res.locals.currentUser = req.session.userId
  next()
})

// CONNECT to mongodb & error handler
var port = 27017
projDB = 'bookworm'
mongoose.connect(`mongodb://localhost:${port}/${projDB}`, {useMongoClient: true})
var db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection error:'))

// PARSE incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// STATIC FILES served from /public
app.use(express.static(__dirname + '/public'));

// PUG VIEW ENGINE setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// ROUTES
var routes = require('./routes/index');
app.use('/', routes);

// CATCH 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found?');
  err.status = 404;
  next(err);
});

// ERROR HANDLER
// define as the last app.use callback before listen
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  })
// Log errors to server as well
  console.log(`${err.status} - ${err.message}`)
});

// LISTEN on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
