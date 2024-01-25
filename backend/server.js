require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const SpotifyWebApi = require("spotify-web-api-node")
const mongoose = require("mongoose") 
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const DBpass = process.env.MONGODB_PASS

const uri =  `mongodb+srv://superuser:${DBpass}@cluster0.6ynczxx.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(uri);

const db = mongoose.connection; 


const roomSchema = new mongoose.Schema({
  // Define your schema fields and their types
  playlistName: String,
  accessCode: Number,
  ownerName: String,
  // ... add more fields as needed

});
const roomModel = mongoose.model('roomDetails', roomSchema);

db.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

db.once('open', () => {
  console.log(' Connected to MongoDB');
});

app.post('/newroom', async (req, res) => {




  try {
    const dataToInsert =req.body 
    const result = await roomModel.create(dataToInsert)
    res.json({success: true, insertedData: result})

  }
  catch (err){
    console.error('Error inserting to DB: ', err)
    res.status(500).json({success: false, error: error.message})
  }
})

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  })

  spotifyApi
    .refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      })
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
})

app.post("/createplaylist", (req,res) =>{

  console.log(req)

  let playlistName = req.body.playlistName
  let accessToken = req.body.accessToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  spotifyApi.setAccessToken(accessToken);
  console.log("Creating Playlist ...")
  
  spotifyApi.createPlaylist(playlistName, { 'description': 'My testfromserver', 'public': false })
  .then(function(data) {
    console.log('Created playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });
  
})

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
