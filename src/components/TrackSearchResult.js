import React from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  { useState ,useEffect } from 'react';

const HOST = process.env.REACT_APP_HOST_SERVER




export default function TrackSearchResult({songBalance, setSongBalance,adminAccess , userName, playlistName, partyName, track, key1, playlistId, accessToken, setSearch }) {
  const [ songBalanceTrigger, setSongBalanceTrigger ] = useState(false);

  useEffect(() => {
    const getSongBalance = async () => {
      try {

        console.log('triggered song balance')
        const response = await axios.get(`${HOST}/getsongbalance`, {
          params: {
            userName,
            partyName, 
            playlistName,
          },
        });
        console.log('response from server :' ,response.data.songBalance); // Log inside the function
        setSongBalance( response.data.songBalance);
        return response.data.songBalance;
      } catch (error) {
        console.log(error);
      }
    };
    if ( !adminAccess)

    {getSongBalance();} // Call the function
  
  }, [songBalanceTrigger]);
  
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
      
      console.log(HOST)

      axios.post(`${HOST}/addtrack`, requestBody)
      .then(function (response) {
        console.log('Track added successfully:', response.data);
        toast(`Added Song ${track.title}`);
        setSongBalanceTrigger(!songBalanceTrigger);

        

        setSearch('');

      })
      .catch(function (error) {
        console.error('Error adding track:', error);
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
