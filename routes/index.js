var express = require('express');
var db = require('../db');
var router = express.Router();
var ensure = require('connect-ensure-login');

module.exports = function(passport) {
  router.get('/', function(req, res, next) {
    res.render('index', { 
      title: 'GreenSpot',
      picnicSpots: JSON.stringify(db.spots.spots),
      user: req.user || null
    });
  });

  router.get('/post', ensure.ensureLoggedIn('/user/login'), function(req, res, next) {
    res.render('post', { 
      title: 'GreenSpot',
      picnicSpots: JSON.stringify(db.spots.spots),
      user: req.user || null
    });
  });

  router.post('/post', function(req, res) {
    db.spots.createSpot(req.body.longitude, req.body.latitude, req.body.rating, req.body.review, req.user.username, Date.now());
    res.redirect('/');
  });

  router.post('/review', function(req, res) {
    db.spots.addReview(req.body.spotID, parseInt(req.body.rating), req.body.review, req.user.username, Date.now());
    res.redirect('/');
  });

  return router;
}