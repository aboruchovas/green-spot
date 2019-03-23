var express = require('express');
var router = express.Router();

module.exports = function(passport) {
  router.get('/login', function(req, res) {
    res.render('login', { title: 'Login', user: req.user || null });
  });
    
  router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login'
  }), function(req, res) {
    res.redirect('/');
  });
    
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  
  router.get('/profile', require('connect-ensure-login').ensureLoggedIn(), function(req, res) {
    res.render('profile', { user: req.user || null });
  });

  return router;
}