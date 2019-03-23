var express = require('express');
var router = express.Router();

var picnicSpots = `[
  {
    rating: 0,
    reviews: ['very bad'],
    location: [-1.47008, 53.3811]
  },
  {
    rating: 4,
    reviews: ['really good'],
    location: [-1.47018, 53.3813]
  },
  {
    rating: 5,
    reviews: ['the best'],
    location: [-1.4705, 53.3810]
  },
  {
    rating: 2,
    reviews: ['not so good'],
    location: [-1.47001, 53.3802]
  }
]`;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'GreenSpot',
    picnicSpots
  });
});

module.exports = router;
