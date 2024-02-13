import React, { useState } from 'react';import axios from "axios"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// const notify = () => toast('Succesfully added song ');


export default function TrackSearchResult({ track, chooseTrack, key1, playlistId,accessToken,setSearch }) {
  function handlePlay() {
    console.log(key1)
    console.log(playlistId)
    const requestBody = {
      trackIdName: key1,
      playlistId: playlistId,
      accessToken: accessToken
    };
    axios.post('http://localhost:3001/addtrack', requestBody)
    
  .then(function (response) {
    console.log('Track added successfully:', response.data);
    toast(`Added Song ${track.title}`);
    setSearch('')
    
  })
  .catch(function (error) {
    console.error('Error adding track:', error);
    toast(`Could not add song :(`  );
  });
    




  }

  return (
    <div 
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" , color: "white"}}
      onClick={handlePlay}
    >
      <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} />
      <div className="ml-3">
        <div>{track.title}</div>
        <div className="text-muted">{track.artist}</div>
      </div>

    </div>
  )
}
