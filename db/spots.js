const fs = require('fs');
const file = require('path').resolve(__dirname, 'spots.json');

let rawData = fs.readFileSync(file);
let spots = JSON.parse(rawData).spots;

function saveData() {
  const dataToSave = JSON.stringify({ spots }, null, 2);
  fs.writeFileSync(file, dataToSave);
}

exports.createSpot = function(longitude, latitude, rating, review, user, date) {
  process.nextTick(function() {
    spots.push({
      id: spots.length+1,
      reviews:  [
        { user, rating, review, date }
      ],
      location: [longitude, latitude]
    })
    saveData();
  })
}

exports.addReview = function(spotID, rating, review, user, date) {
  process.nextTick(function() {
    spots.forEach(spot => {
      if (spot.id == spotID) {
        spot.reviews.push({ user, rating, review, date });
      }
    });
    saveData();
  })
}

exports.spots = spots;