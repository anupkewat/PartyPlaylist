import React, { useState } from 'react';
import './trackCard.css'
import axios from 'axios'
const HOST = process.env.REACT_APP_HOST_SERVER
const TrackCard = ({ playlistId, id, songName, artistName, imageUrls }) => {

  const HOST = process.env.REACT_APP_HOST_SERVER
  // console.log( process.env)
const [heart , setHeart] = useState(false)
const [times, setTimes] = useState(false)

  const handleHeartClick = async (songId ,playlistId) => {
    
    if ( !heart ) {

      try {

        const response = await axios.post(`${HOST}/likeSong`, {
          playlistId,
          songId
        });
        setHeart(!heart);
        console.log(`Heart clicked for track:`, songId);
      } catch (error) {
        console.error(`Error liking song:`, error);
      }
    
      return
    }
    else {
    try  {
      

      const response = await axios.post(`${HOST}/unlikeSong`, {
        playlistId,
        songId
      });
      console.log(`Heart un-clicked for track:`, songId);
      setHeart(!heart);
    }
    catch (error) {
      console.error(`Error unliking song:`, error);
    }
    }
    
  };

  const handleTimesClick = async (songId ,playlistId) => {
    
    if ( !times ) {

      try {

        const response = await axios.post(`${HOST}/dislikeSong`, {
          playlistId,
          songId
        });
        setTimes(!times);
        
      } catch (error) {
        console.error(`Error liking song:`, error);
      }
    
      return
    }
    else {


     
        try  {
          
    
          const response = await axios.post(`${HOST}/undislikeSong`, {
            playlistId,
            songId
          });
          setTimes(!times);
        }
        catch (error) {
          console.error(`Error undisliking song:`, error);
        
        }
    }

    
  };


  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        integrity="sha512-...your-integrity-hash-here..."
        crossOrigin="anonymous"
      />
      <div className="ui-div">
        <div className="track-cover">
          {imageUrls.length > 0 && <img src={imageUrls[0]} alt={`Image`} />}
        </div>
        <div className="song-details">
          <div className="song-title marquee">
            {songName}
            <div className="artist-details marquee">{artistName} </div>
          </div>
        </div>
        <div className="icons-row">
          <a  className= {heart ? "icons-row-red" : "icons-row-white"} onClick={() => handleHeartClick(id, playlistId)}>
            <i className="fas fa-heart fa-fw" />
          </a>
          <a className = {times ? "icons-row-red" : "icons-row-white"} onClick={() => handleTimesClick(id, playlistId)}>
            <i className="fas fa-times fa-fw" />
          </a>
        </div>
      </div>
    </>
  );
};

export default TrackCard;
