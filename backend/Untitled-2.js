const SpotifyWebApi = require("spotify-web-api-node")

const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })

accessToken = 'BQCFqe2lvGD1KoHtzyL2zgK3nu03a-vNtDGWUlTZo8Mv87ruD9hZ5cgFd31AdqwTgcs-r_O-8DNXxd5MagGduNpuAUFaAwl-BH-3H0Oywd0Fg9bd9-Ibarr5917DgOhrHwMGsoNifzvy6iqUl0Y1lpE8xC3IR4V87d6jP4fjDa4j1FVoFN0Z8AV4O6S7cL1EsyOcFeLSLjMmiWWLgmd7A4dn-OTTZaD03MwllA42tLYU0-BQqv875U1wzrvsiPWica__JufRepX79UE3LHSeUw_XtXMUZQlWHzHhlMrDhSlxpME'

spotifyApi.setAccessToken(accessToken);
  console.log("Creating Playlist ...")
  
  spotifyApi.createPlaylist('test', { 'description': 'My testfromserver', 'public': false })
  .then(function(data) {
    console.log('Created playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

