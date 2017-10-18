var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/signup', function(req, res){
  res.render('signup.ejs', {title: "Sign Up", message: req.flash('signupMessage')});
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/auth/login',
  failureRedirect: '/auth/signup',
  failureFlash: true
}));


//LOGIN
router.get('/login', function(req, res){
  res.render('login', {title: "Login", message: req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: "/profile",
  failureRedirect: "/auth/login",
  failureFlash: true
}));

//FACEBOOK LOGIN
router.get('/facebook', passport.authenticate('facebook', {scope: ['user_friends', 'email', 'public_profile']}));

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/profile',
  failureRedirect: '/auth/login'
}));

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;