var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');

var helmet = require('helmet');
var mongoose = require('mongoose');
var url = require('./config/db.js').url;
mongoose.connect(url);
var passport = require('passport');
var flash = require('connect-flash');
var Yelp = require('yelp');
var app = express();

//APP CONFIG
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(helmet());
app.use(morgan('dev'));

app.use(function(req,res, next){
  res.locals.user = req.user;
  next();
})

//DB
var db = mongoose.connection;
db.on('error', function(err){
  console.log("Unable to connect to DB: " + db);
});
db.on('open', function(err){
  if(err){
    console.log(err);
  }
  console.log("Connected to DB");
});
var User = require('./model/user');
var Place = require('./model/place');

// PASSPORT JS
//Passport Config
require('./config/passport.js')(passport);

// YELP
var client = require('./config/yelp.js');

//APP START
var auth = require('./routes/auth.js');
app.use('/auth', auth);
var profile = require('./routes/profile.js');
app.use('/profile', profile);
app.use(function(req, res, next){
  res.locals.user = req.user;
  next();
});

app.get('/', function(req, res){
  var responseArr = [];
  res.render('mainpage', {title: "Main Page", responseArr: responseArr});
});

app.get('/search/api', function(req, res){
  var searchInput = req.query.search;
  var yelpSearch = client.search({
    term: "bar",
    location: searchInput
  })
  .then(function(response){
    var responseArr = response.jsonBody.businesses;
    res.render('searchResult', {title: 'Search Result',
                                responseArr: responseArr,
                                message: req.flash('reserveMessage')});
  })
  .catch(function(e){
    console.log(e)
    res.status(404).send('There is an error or Please make sure you enter correct input requirement');
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log('listening on port 3000');
})