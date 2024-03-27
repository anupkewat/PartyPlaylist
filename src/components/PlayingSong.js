import React, { useState } from "react";
import "./playingtrackcard.css";
const HOST = process.env.REACT_APP_HOST_SERVER;
const PlayingSong = ({
  accessToken,
  playlistId,
  id,
  songName,
  artistName,
  imageUrls,
  skipToNext,
  skipToPrevious,
  togglePlayback,
  isPlaying,
}) => {
  const HOST = process.env.REACT_APP_HOST_SERVER;
  // console.log( process.env)
  const [heart, setHeart] = useState(false);
  const [times, setTimes] = useState(false);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        integrity="sha512-...your-integrity-hash-here..."
        crossOrigin="anonymous"
      />
      <div className="ui-div-1">
        <div className="track-cover-1">
          {<img src={imageUrls} alt={`Image`} />}
        </div>
        <div className="song-details-1">
          <div className="song-title-1 marquee">
            {songName}
            <div className="artist-details-1 marquee">{artistName} </div>
          </div>
        </div>
        <div className="icons-row-1">
          <a
            className={times ? "icons-row-1-red" : "icons-row-1-white"}
            onClick={() => skipToPrevious()}
          >
            <i className="fas fa-backward fa-fw" />
          </a>
          <a
            className={times ? "icons-row-1-red" : "icons-row-1-white"}
            onClick={() => togglePlayback()}
          >
            <i
              className={isPlaying ? "fas fa-play fa-fw" : "fas fa-pause fa-fw"}
            />
          </a>

          <a
            className={times ? "icons-row-1-red" : "icons-row-1-white"}
            onClick={() => skipToNext()}
          >
            <i className="fas fa-forward fa-fw" />
          </a>
        </div>
      </div>
    </>
  );
};

export default PlayingSong;
