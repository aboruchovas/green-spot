const fs = require('fs');
const file = require('path').resolve(__dirname, 'users.json');
// const file = require('path').resolve(require('os').tmpdir(), 'users.json');

// let rawData;
// try {
//   rawData = fs.readFileSync(file);
// } catch(err) {
//   rawData = '{ "records": [] }';
// }

let rawData = fs.readFileSync(file);
let records = JSON.parse(rawData).records;

function saveData() {
  const dataToSave = JSON.stringify({ records }, null, 2);
  fs.writeFileSync(file, dataToSave);
}

// var records = [
//   { id: 1, username: 'arnas', password: '123', displayName: 'Arnas', email: 'arnas@example.com' },
//   { id: 2, username: 'greg', password: '123', displayName: 'Greg', email: 'greg@example.com' }
// ];

exports.findById = function(id, callback) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      callback(null, records[idx]);
    } else {
      callback(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, callback) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return callback(null, record);
      }
    }
    return callback(null, null);
  });
}

exports.createUser = function(username, displayName, email, password) {
  process.nextTick(function() {
    var unique = true;
    records.forEach(user => {
      if (user.username == username || user.email == email) {
        unique = false;
      }
    });
    if (unique) {
      records.push({
        id: records.length + 1, username, displayName, email, password
      })
      saveData();
    }
  })
}