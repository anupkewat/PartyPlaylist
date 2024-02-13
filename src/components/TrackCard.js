import React, { useState } from 'react';
import './trackCard.css'

const TrackCard = ({ id, songName, artistName, imageUrls }) => {
const [heart , setHeart] = useState(false)
const [times, setTimes] = useState(false)

  const handleHeartClick = (trackId) => {
    
    if ( !heart ) {
      setHeart(!heart);
      console.log('Heart clicked for track:', trackId);
      return
    }
    setHeart(!heart);

    
  };

  const handleTimesClick = (trackId) => {
    if ( !times ) {
      setTimes(!times);
      console.log('Times clicked for track:', trackId);
      return
    }
    setTimes(!times);
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
          <a  className= {heart ? "icons-row-red" : "icons-row-white"} onClick={() => handleHeartClick(id)}>
            <i className="fas fa-heart fa-fw" />
          </a>
          <a className = {times ? "icons-row-red" : "icons-row-white"} onClick={() => handleTimesClick(id)}>
            <i className="fas fa-times fa-fw" />
          </a>
        </div>
      </div>
    </>
  );
};

export default TrackCard;
