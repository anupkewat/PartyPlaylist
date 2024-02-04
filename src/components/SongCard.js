import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';


const AudioPlayer = ({ trackName, artistNames, images }) => {
  return (
    <div className="audio-player">
      <div className="album-cover" alt= {trackName} style={{ backgroundImage: `url(${images})` }}></div>
      
      <div className="player-controls">
        <div className="song-info">
          <div className="song-title">{trackName}</div>
          <p className="artist">{artistNames}</p>
        </div>
        
        <div className="buttons">
          <button className="play-btn">
            <svg viewBox="0 0 16 16" className="bi bi-play-fill" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" style={{ color: 'white' }}>
              <path fill="white" d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
            </svg>
          </button>
          <button className="pause-btn">
            <svg viewBox="0 0 16 16" className="bi bi-pause-fill" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" style={{ color: 'white' }}>
              <path fill="white" d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

AudioPlayer.propTypes = {
  trackName: PropTypes.string.isRequired,
  artistNames: PropTypes.string.isRequired,
  images: PropTypes.string,
};

export default AudioPlayer;
