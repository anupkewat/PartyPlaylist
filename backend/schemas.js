const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  DisplayName: String,
  userID: String,
  playlistId : String,
  playlistName: String,
  ownerName: String,
  partyName: String,
  accessToken: String,
  password: String
});

const PlaylistModel = mongoose.model('Playlist', playlistSchema);

module.exports = PlaylistModel;
