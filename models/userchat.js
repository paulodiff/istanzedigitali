var userId = 0;
var users = {};

// crea degli Id utente
exports.create = function(cb) {
  console.log('userchat.js:create');
  userId += 1;
  var user = users[userId] = { id: userId };
  console.log(user);
  cb(null, user);
}

exports.get = function(id) {
  var user = users[id];
  if(user) {
    cb(null, user);
  } else {
    cb(new Error("missing"));
  }
}
