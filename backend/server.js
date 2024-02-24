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


const queueDetailsSchema = new mongoose.Schema({
  playlistId: { type: String, required: true },
  songs: [{
    id: { type: String },
    name: { type: String },
    numberOfLikes: { type: Number, default: 0 },
    numberOfDislikes: { type: Number, default: 0 }
  }]
});
const QueueDetailsModel = mongoose.model('QueueDetails', queueDetailsSchema);



db.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

db.once('open', () => {
  console.log(' Connected to MongoDB');
});


const extractTrackInfo = (apiResponse) => {
  const tracks = apiResponse.tracks.items;

  const trackInfoArray = tracks.map((track) => {
    const trackData = track.track;

    return {
      id: trackData.id,
      name: trackData.name,
      
    };
  });

  return trackInfoArray;
};

app.get("/joinplaylist" , async (req,res) => {
  const partyName = req.query.partyName
  const userName = req.query.userName
  await playlistModel.findOne({ partyName: partyName })
  .then((data)=> {
    console.log('Found Playlist', data);  
    res.json(data)
  }, function(err) {
    console.log('Could not find room', err);
  });


})

app.post("/addtrack" , async (req,res) => {
  const trackId = req.body.trackIdName;
  const playlistId = req.body.playlistId;
  const accessToken =  req.body.accessToken;

  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  spotifyApi.setAccessToken(accessToken);

  spotifyApi.addTracksToPlaylist(playlistId, [trackId])
    .then(function(data) {
      console.log('Added tracks to playlist!');
      res.status(200).send({ success: true, message: 'Track added to playlist successfully' });
    })
    .catch(function(err) { 
      console.log('Something went wrong!', err);
      res.status(500).send({ success: false, message: 'Failed to add track to playlist' });
    });
});

app.get("/getpopularity", async (req, res) =>{
  try {
    const playlistId = req.query.playlistId;
    const songId = req.query.songId;

    const queueDetails = await QueueDetailsModel.findOne({ playlistId: playlistId });

    if (!queueDetails) {
      return res.status(404).json({ error: 'Queue details not found for the provided playlistId' });
    }

    const song = queueDetails.songs.find(song => song.id === songId);

    if (!song) {
      return res.status(404).json({ error: 'Song not found in the playlist' });
    }

    res.json({
      // songId: song.id,
      // name: song.name,
      numberOfLikes: song.numberOfLikes,
      numberOfDislikes: song.numberOfDislikes
    });
  } catch (err) {
    console.error('Error searching for song:', err);
    res.status(500).json({ error: 'Failed to search for song' });
  }
});
   
app.post("/likeSong", async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    // Find the queue details document based on the playlistId
    let queueDetails = await QueueDetailsModel.findOne({ playlistId: playlistId });

    if (!queueDetails) {
      return res.status(404).json({ error: 'Queue details not found for the provided playlistId' });
    }

    // Find the song in the queue details by its ID
    const song = queueDetails.songs.find(song => song.id === songId);

    if (!song) {
      return res.status(404).json({ error: 'Song not found in the playlist' });
    }

    // Increment the number of likes for the song
    song.numberOfLikes++;

    // Save the updated queue details document
    await queueDetails.save();

    // Return the updated song details
    res.json({
      songId: song.id,
      name: song.name,
      numberOfLikes: song.numberOfLikes,
      numberOfDislikes: song.numberOfDislikes,
      success : true
    });
  } catch (err) {
    console.error('Error liking song:', err);
    res.status(500).json({ error: 'Failed to like song' });
  }
});
app.post("/unlikeSong", async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    // Find the queue details document based on the playlistId
    let queueDetails = await QueueDetailsModel.findOne({ playlistId: playlistId });

    if (!queueDetails) {
      return res.status(404).json({ error: 'Queue details not found for the provided playlistId' });
    }

    // Find the song in the queue details by its ID
    const song = queueDetails.songs.find(song => song.id === songId);

    if (!song) {
      return res.status(404).json({ error: 'Song not found in the playlist' });
    }

    // Increment the number of likes for the song
    if ( song.numberOfLikes > 0)
    {song.numberOfLikes--;

    // Save the updated queue details document
    await queueDetails.save();
    }
    // Return the updated song details
    res.json({
      songId: song.id,
      name: song.name,
      numberOfLikes: song.numberOfLikes,
      numberOfDislikes: song.numberOfDislikes,
      success : true
    });
  } catch (err) {
    console.error('Error liking song:', err);
    res.status(500).json({ error: 'Failed to like song' });
  }
});
app.post("/undislikeSong", async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    // Find the queue details document based on the playlistId
    let queueDetails = await QueueDetailsModel.findOne({ playlistId: playlistId });

    if (!queueDetails) {
      return res.status(404).json({ error: 'Queue details not found for the provided playlistId' });
    }

    // Find the song in the queue details by its ID
    const song = queueDetails.songs.find(song => song.id === songId);

    if (!song) {
      return res.status(404).json({ error: 'Song not found in the playlist' });
    }

    // Increment the number of likes for the song
    if ( song.numberOfDislikes > 0)
        {song.numberOfDislikes--;

        // Save the updated queue details document
        await queueDetails.save();
        }
    // Return the updated song details
    res.json({
      songId: song.id,
      name: song.name,
      numberOfLikes: song.numberOfLikes,
      numberOfDislikes: song.numberOfDislikes,
      success : true
    });
  } catch (err) {
    console.error('Error liking song:', err);
    res.status(500).json({ error: 'Failed to like song' });
  }
});
app.post("/dislikeSong", async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    // Find the queue details document based on the playlistId
    let queueDetails = await QueueDetailsModel.findOne({ playlistId: playlistId });

    if (!queueDetails) {
      return res.status(404).json({ error: 'Queue details not found for the provided playlistId' });
    }

    // Find the song in the queue details by its ID
    const song = queueDetails.songs.find(song => song.id === songId);

    if (!song) {
      return res.status(404).json({ error: 'Song not found in the playlist' });
    }

    // Increment the number of likes for the song
    song.numberOfDislikes++;

    // Save the updated queue details document
    await queueDetails.save();

    // Return the updated song details
    res.json({
      songId: song.id,
      name: song.name,
      numberOfLikes: song.numberOfLikes,
      numberOfDislikes: song.numberOfDislikes,success : true
    });
  } catch (err) {
    console.error('Error liking song:', err);
    res.status(500).json({ error: 'Failed to like song' });
  }
});



app.get("/getplaylistitems", async (req, res) => {
  try {
    const playlistId = req.query.playlistId;
    const accessToken = req.query.accessToken;

    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.REDIRECT_URI,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    spotifyApi.setAccessToken(accessToken);

    const data = await spotifyApi.getPlaylist(playlistId);
    const api_response = data.body;
    const tracklist = extractTrackInfo(api_response);

    // Find or create the queue details document based on the playlistId
    let queueDetails = await QueueDetailsModel.findOne({ playlistId: playlistId });

    if (!queueDetails) {
      // console.log('Queue details not found. Creating new entry...');
      queueDetails = await QueueDetailsModel.create({ playlistId: playlistId, songs: [] });
      // console.log('New queue details entry created:', queueDetails);
    }

    queueDetails.songs = queueDetails.songs.filter(song => {
      return tracklist.some(track => track.id === song.id);
    });

    for (const playlistItem of tracklist) {
      const { id, name } = playlistItem;

      // Check if the track exists in the queue details
      const existingSong = queueDetails.songs.find(song => song.id === id);

      // If the track does not exist in the queue details, add it with default values for likes and dislikes
      if (!existingSong) {
        queueDetails.songs.push({ id: id, name: name, numberOfLikes: 0, numberOfDislikes: 0 });
        console.log(`Added track ${name} to queue details`);
      }
    }

    // Save the updated queue details document
    await queueDetails.save();

    console.log('Updated queue details:', queueDetails);
    res.json(data.body); // Send the playlist data as response
  } catch (err) {
    console.error('Error retrieving playlist:', err);
    res.status(500).json({ error: 'Failed to retrieve playlist' });
  }
});


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

    // console.log(spotifyResponse );


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
    // console.log(playlistEntry)
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
