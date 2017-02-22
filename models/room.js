var rooms = {};
var roomCount = 0;

exports.create = function(id) {
  rooms[id] = new Room(id);
}

exports.get = function(id) {
  return rooms[id];
}

function Room(id) {
  this.chats = [];
}

require("util").inherits(Room, require("events").EventEmitter);

Room.prototype.chat = function(chat) {
  // aggiunge la chat in alto
  this.chats.unshift(chat);
  // emette l'evento'
  this.emit("chat", chat);
};

Room.prototype.latest = function() {
  // ritorna i primi elementi
  return this.chats.slice(0, 20);
};

