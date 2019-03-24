var express = require('express');
var db = require('../db');
var router = express.Router();
var ensure = require('connect-ensure-login');

module.exports = function(passport) {
  router.get('/login', function(req, res) {
    res.render('login', { title: 'Login', user: req.user || null });
  });
    
  router.post('/login', passport.authenticate('local', {
    failureRedirect: '/user/login',
    successRedirect: '/'
  }));
    
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  router.get('/signup', function(req, res) {
    res.render('signup', { title: 'Sign up', user: req.user || null });
  });

  router.post('/signup', function(req, res) {
    db.users.createUser(req.body.username, req.body.name, req.body.email, req.body.password);
    res.render('signup', { title: 'Sign up', user: req.user || null });
  });
  
  router.get('/profile', ensure.ensureLoggedIn(), function(req, res) {
    res.render('profile', { user: req.user || null });
  });

  return router;
}