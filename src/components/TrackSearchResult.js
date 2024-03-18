import React from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TrackSearchResult({ songBalanceTrigger, setSongBalanceTrigger, adminAccess, songBalance , setSongBalance, userName, playlistName, partyName, track, key1, playlistId, accessToken, setSearch }) {
  function handleSelection() {
    console.log(key1);
    console.log(playlistId);
    const requestBody = {
      trackIdName: key1,
      playlistId: playlistId,
      accessToken: accessToken,
      userName: userName,
      playlistName: playlistName,
      partyName : partyName
    };
    if ( adminAccess || songBalance > 0) // if available balance
    {



      axios.post('http://localhost:3001/addtrack', requestBody)
      .then(function (response) {
        console.log('Track added successfully:', response.data);
        toast(`Added Song ${track.title}`);
        setSongBalanceTrigger(!songBalanceTrigger);

        

        setSearch('');

      })
      .catch(function (error) {
        console.error('Error adding track:', error);
        toast(`Could not add song :(`);
      });
      


    }
    else {
      toast(`Not enough balance :(`);
    }
  }

  return (
    <div
      className="search-result-container"
      style={{ cursor: "pointer", width: "300px", color: "white", paddingLeft: "20px" }}
      onClick={handleSelection}
    >
      <img src={track.albumUrl} style={{ height: "64px", width: "64px", color: "white", borderRadius : "8px" }} />
      <div className="ml-3"
            style={{ paddingLeft: "20px" }}

      >
        <div style={{ color: "white", fontSize: "12px" }}>{track.title}</div>
        <div style={{ fontSize: "10px" }}>{track.artist}</div>
      </div>
    </div>
  );
}
