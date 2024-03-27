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

const playlistWorkingDetailsSchema = new mongoose.Schema({
  playlistName: { type: String, required: true },
  partyName: { type: String, required: true },
  refreshInterval: { type: Number, default: 5 },
  songLimit: { type: Number, default: 5 },
  capacity: { type: Number, default: 50 }
});
const PlaylistWorkingDetailsModel = mongoose.model('playlistWorkingDetails', playlistWorkingDetailsSchema);


const userDetailsSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  isBlocked: { type: Boolean, default: false },
  songBalance: { type: Number },
  partyName: { type: String, required: true },
  playlistName: { type: String, required: true },
})

const userDetailsModel = mongoose.model('UserDetails', userDetailsSchema);

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

app.get("/getworkinginfo" , async (req,res) => {
  const partyName = req.query.partyName
  const playlistName = req.query.playlistName
  await PlaylistWorkingDetailsModel.findOne({ partyName: partyName , playlistName: playlistName })  
  .then((data)=> {
    res.json(data)
  }, function(err) {
    console.log('Could not room wokring details', err);
  });

})

app.get("/joinplaylist" , async (req,res) => {

  const partyName = req.query.partyName
  const playlistName = req.query.playlistName
  const password = req.query.password
  const userName = req.query.userName

   

  userDetails  = await userDetailsModel.findOne({ userName: userName, playlistName: playlistName , partyName: partyName })
  .then(async (data, userDetails) => {
    if(userDetails){
      if (data.isBlocked){
        res.sendStatus(406);
      }

    }
    else{
      console.log('new user here')
      
      const playlistWorkingDetails = await PlaylistWorkingDetailsModel.findOne({ partyName: partyName , playlistName: playlistName })
      if(playlistWorkingDetails)
      {
      songBalance = playlistWorkingDetails.songLimit; //default balance for new users
      console.log(`FOUND PLAYLIST WITH SONG LIMIT ${songBalance}`)}
      else
      {
        console.log('songBalance set to 0')
        songBalance = 0
      }

      const newUser = new userDetailsModel({
        userName: userName,
        partyName: partyName,
        playlistName: playlistName,
        songBalance: songBalance
      });
      console.log( 'newUser : ' , newUser)
      await newUser.save();
    }
    await playlistModel.findOne({ partyName: partyName , playlistName: playlistName, password: password })  
    .then((data)=> {
      // console.log('Found Playlist', data);  
      res.json(data)
    }, function(err) {
      console.log('Could not find room', err);
    });

  }, function(err) {
    console.log('Error finding user', err);
  });


})


app.post("/addtrack" , async (req,res) => {
  const trackId = req.body.trackIdName;
  const playlistId = req.body.playlistId;
  const accessToken =  req.body.accessToken;
  const userName = req.body.userName; 
  const partyName = req.body.partyName; 
  const playlistName = req.body.playlistName;
  // try to reduce balance by 1 and catch with appropriate error  
  if  ( userName || playlistName  || partyName )
  { console.log('NON ADMIN ACCESS')
    try {
    const userDetails = await userDetailsModel.findOne({ userName: userName, playlistName: playlistName, partyName: partyName });
    // reduce the balance of the user by 1 
    console.log(userDetails)
    userDetails.songBalance = userDetails.songBalance - 1;
    await userDetails.save();
  } catch (error) {
    console.error('Error occurred while updating user details:', error);
    throw error;
  }
}
  

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
    if (accessToken === undefined || playlistId === undefined) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.REDIRECT_URI,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    spotifyApi.setAccessToken(accessToken);

    const data = await spotifyApi.getPlaylist(playlistId);
    const api_response = data.body;
    const tracklist = extractTrackInfo(api_response);

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

      const existingSong = queueDetails.songs.find(song => song.id === id);

      if (!existingSong) {
        queueDetails.songs.push({ id: id, name: name, numberOfLikes: 0, numberOfDislikes: 0 });
        console.log(`Added track ${name} to queue details`);
      }
    }

    await queueDetails.save();

    // console.log('Updated queue details:', queueDetails);
    res.json(data.body); // Send the playlist data as response
  } catch (err) {
    console.error('Error retrieving playlist:', err);
    res.status(500).json({ error: 'Failed to retrieve playlist' });
  }
});




app.post("/createplaylist", async (req, res) => {
  try {
    // console.log(req)
    console.log('@/createplaylist')
    const ownerName = req.body.ownerName; 
    const partyName = req.body.partyName;
    const playlistName = req.body.playlistName;
    const accessToken = req.body.accessToken;
    const password = req.body.password
      
  
    if (!accessToken) {
      console.log("Missing Access token")

      return res.status(401).json({ success: false, error: "Missing access token" });

    }
    // console.log(ownerName, partyName, playlistName, password )
    const existingPlaylist = await playlistModel.findOne({ ownerName, partyName, playlistName });

    if (existingPlaylist) {
        console.log("Playlist with the same owner, party, and name already exists")
        return res.status(402).json({ success: false, error: "Playlist with the same owner, party, and name already exists" });
    }
    console.log(process.env)
    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.REDIRECT_URI,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    // console.log(accessToken)

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
      accessToken: accessToken, 
      password: password
    };

    const playlistEntry = await playlistModel.create(playlistDetails);

    const playlistWorkingDetails = await PlaylistWorkingDetailsModel.create({
      playlistName: playlistName,
      partyName: partyName,
    });
    // console.log(playlistEntry)
    res.status(201).json({ success: true, message: 'Playlist created and logged to DB'});

  } catch (err) {
    console.log('Something went wrong!', err);
    res.status(500).json({ success: false, error: err.message });


  
    
  }
});


app.get("/getsongbalance", async (req, res) => {
  
  try {
    console.log('@/getsongbalance')
    const userName = req.query.userName;
    const partyName = req.query.partyName;
    const playlistName = req.query.playlistName;

    const userDetails = await userDetailsModel.findOne({
      partyName,  
      playlistName,
      userName
    });

    if (!userDetails) {
      return res.status(404).json({ error: "User details not found" });
    }

    const { songBalance } = userDetails;

    console.log(`User ${userName} song balance: ${songBalance}`);
    
    res.json({ songBalance: songBalance });

  } catch (err) {
    console.error("Error retrieving user details:", err);
    res.status(500).json({ error: "Failed to retrieve user details" });
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

app.post("/updateaccesstoken" , async (req,res) =>{

  try {
    const {ownerName, partyName, playlistName, password, accessToken } = req.body
    // console.log({ownerName, partyName, playlistName, password, accessToken })
    const existingPlaylist = await playlistModel.findOne({ ownerName, partyName, playlistName, password })

    if ( !existingPlaylist){
      console.log('invalid creds')
      return res.status(404).json({success: false, error: "PLaylist not found or incorrect password"})
    }

    existingPlaylist.accessToken = accessToken
    await existingPlaylist.save();
    const playlistEntry = existingPlaylist;
    res.status(201).json({ success: true, message: 'Playlist Rejoined',playlistEntry });

  }
  catch(err) {
    console.log('error while rejoining playlist')    
    res.status(500).json({ success: false, error: err.message });  
    
    
  }
})

app.post('/reorderplaylist', async (req, res) => {
  try {
    const playlistId = req.body.playlistId;
    const accessToken = req.body.accessToken;

    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.REDIRECT_URI,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      accessToken: accessToken
    });

    // Fetch tracks from the playlist
    const trackList = await getPlaylistTracks(spotifyApi, playlistId);

    console.log('fecthing spotify playlist...');
    
    const queueDetails = await QueueDetailsModel.findOne({ playlistId: playlistId });
    // console.log(queueDetails)

    if (!queueDetails) {
      console.log(queueDetails)
      return res.status(404).json({ error: 'Queue details not found for the provided playlistId' });
    }


    const sortedTracks = sortTracksByLikesAndDislikes(queueDetails.songs);
    // console.log(sortedTracks)
    
    // Reorder tracks in the playlist
    await reorderPlaylistTracks(spotifyApi, playlistId, sortedTracks);

    res.status(200).json({ message: 'Playlist reordered successfully' });

  } catch (err) {
    console.error('Error reordering playlist:', err);
    res.status(500).json({ error: 'Failed to reorder playlist' });
  }
});

async function getPlaylistTracks(spotifyApi, playlistId) {
  try {
    const data = await spotifyApi.getPlaylist(playlistId);
    const tracks = extractTrackInfo(data.body);
    return tracks;
  } catch (err) {
    console.error('Error fetching playlist tracks:', err);
    return [];
  }
}
function sortTracksByLikesAndDislikes(songs) {
  return songs.sort((a, b) => {
    const aLikes = parseInt(a.numberOfLikes) - parseInt(a.numberOfDislikes);
    const bLikes = parseInt(b.numberOfLikes) - parseInt(b.numberOfDislikes);
    return bLikes - aLikes; 
  });
}

async function reorderPlaylistTracks(spotifyApi, playlistId, sortedTracks) {
  try {
    const trackURIs = sortedTracks.map(track => 'spotify:track:' + track.id);
    // console.log(trackURIs)
    await spotifyApi.replaceTracksInPlaylist(playlistId, trackURIs);
  } catch (err) {
    console.error('Error reordering playlist tracks:', err);
    throw err;
  }
}




app.listen(3001)
