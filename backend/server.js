require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const SpotifyWebApi = require("spotify-web-api-node")
const mongoose = require("mongoose") 
const app = express()
app.use(cors())
const playlistModel = require('./schemas')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const DBpass = process.env.MONGODB_PASS

const uri =  `mongodb+srv://superuser:${DBpass}@cluster0.6ynczxx.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(uri);

const db = mongoose.connection; 



db.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

db.once('open', () => {
  console.log(' Connected to MongoDB');
});

app.get("/getplaylistitems" , async(req,res) => {

  const playlistId = req.body.playlistId
  const accessToken = req.body.accessToken

  
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  spotifyApi.setAccessToken(accessToken);


  spotifyApi.getPlaylist('playlistId')
  .then(function(data) {
    console.log('Some information about this playlist', data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

app.post("/createroom", async (req, res) => {
  async function checkIfPartyNameExists(playlistDetails) {
    try {
      const existingPlaylist = await playlistModel.findOne({ partyName: playlistDetails.partyName });

      if (existingPlaylist) {
        res.status(400).json({ success: false, message: 'Playlist Exists', playlistDetails });

      }

      console.log(`PartyName '${playlistDetails.partyName}' does not exist.`);
      const playlistEntry = await playlistModel.create(playlistDetails);

      res.status(201).json({ success: true, message: 'Playlist created and logged to DB', playlistEntry });


      return false;
    } catch (error) {

      console.error('Error checking partyName:', error);
      throw error;
    }
  }


  try {
    const ownerName = req.body.ownerName;
    const partyName = req.body.partyName;
    const playlistName = req.body.playlistName;
    const accessToken = req.body.accessToken;
    const displayName = req.body.displayName;
    const userId = req.body.userID;
  
    const playlistDetails = {
      DisplayName: displayName,
      userID: userId,
      playlistName: playlistName,
      ownerName: ownerName,
      partyName: partyName,
      accessToken: accessToken
    };
  
    const result = await checkIfPartyNameExists(playlistDetails);

    
    }
   catch (error) {
    console.error('Error', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


app.post("/createplaylist", async (req, res) => {
  try {
    console.log('@/createplaylist')
    const ownerName = req.body.ownerName; 
    const partyName = req.body.partyName;
    const playlistName = req.body.playlistName;
    const accessToken = req.body.accessToken;

    if (!accessToken) {
      return res.status(401).json({ success: false, error: "Missing access token" });
    }

    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.REDIRECT_URI,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    console.log(accessToken)

    spotifyApi.setAccessToken(accessToken);

    console.log("Creating Playlist ...");

    const spotifyResponse = await spotifyApi.createPlaylist(playlistName, { 'description': 'Created by MyParty', 'public': false });

    console.log(spotifyResponse );


    const playlistDetails = {
      DisplayName: spotifyResponse.body.owner.display_name,
      userID: spotifyResponse.body.owner.id,
      playlistId :spotifyResponse.body.id,
      playlistName: playlistName,
      ownerName: ownerName, 
      partyName: partyName, 
      accessToken: accessToken
    };

    const playlistEntry = await playlistModel.create(playlistDetails);
    console.log(playlistEntry)
    res.status(201).json({ success: true, message: 'Playlist created and logged to DB', playlistEntry });
  } catch (err) {
    console.log('Something went wrong!', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/login", (req, res) => {
  console.log('authsuccesful')
  let code = req.body.code
   spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch(err => {
      res.sendStatus(400)
      console.log(err)
    })
})



app.listen(3001)
