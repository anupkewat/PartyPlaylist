import React from 'react';
import './trackCard.css'

const TrackCard = ({ id, songName, artistName, imageUrls }) => {
    // console.log("Props inside TrackCard:", id, songName, artistName, imageUrls);

  const handleHeartClick = () => {
  };

  const handleTimesClick = () => {
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
      <a href="#" onclick="handleHeartClick(this)">
        <i className="fas fa-heart fa-fw" />
      </a>
      <a href="#" onclick="handleTimesClick(this)">
        <i className="fas fa-times fa-fw" />
      </a>
    </div>
  </div>
</>

  );
};

export default TrackCard;
