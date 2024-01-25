const SpotifyWebApi = require("spotify-web-api-node")

const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })

accessToken = ''
spotifyApi.setAccessToken(accessToken);
  console.log("Creating Playlist ...")
  
  spotifyApi.createPlaylist('test', { 'description': 'My testfromserver', 'public': false })
  .then(function(data) {
    console.log('Created playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

