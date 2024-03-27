import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap'; // Assuming you are using Bootstrap for styling
import axios from "axios"
require('dotenv').config()

const RejoinForm = ({accessToken,setCreatedPlaylist, setPlaylistId, password, setPassword, setPlaylistName, playlistName, partyName, setPartyName}) => {
  const HOST = process.env.REACT_APP_HOST_SERVER
  const REACT_HOST = process.env.REACT_HOST || 'http://localhost:3000'

  const [ownerName, setOwnerName] = useState('');
  const [error, setError] = useState(null);


  console.log('@rejoin: rejoining playlist with AT:' ,accessToken)
  
  const handleLogin = () => {
    window.location.href = "http://localhost:3000/login";
  };
  const updateAccessToken = () =>{   
    
    if ( !accessToken ) {
      setError('Missing access token. Please re-login')
      return;
    }
    console.log(accessToken)
    axios
      .post(`${HOST}/updateaccesstoken`, {
        playlistName,accessToken,ownerName,partyName,password
      })
      .then((res)=> {
                


        // axios.post()
        console.log(res)
        const data = res.body


        console.log(`rejoined : ${res.data.playlistEntry}`)
        setPlaylistId(res.data.playlistEntry.playlistId)
        setPlaylistName(res.data.playlistEntry.playlistName)
        setCreatedPlaylist(true)


        

      })
      .catch((err) => { 
        console.log(err)
        setError('Too late to the party, party has ended :( ')
        // 
        console.log('could not rejoin playlist')
      })
      


  }


  const handleSubmit = (e) => {
    e.preventDefault(); 
    // console.log('clicked :)')
    updateAccessToken(); 
    setPlaylistName(playlistName);
    setPassword(password); 
    setPartyName(partyName);
    console.log(playlistName, password, partyName)

  };

  return (
    <div className="center-container">
<div className='form-container'>
        <div className='form'>
          {/* Party Name Input */}
          <div className='form-group'>
            <label>Party Name</label>
            <Form.Control
              type="text"
              placeholder="Enter Party Name"
              value={partyName}
              onChange={e => setPartyName(e.target.value)}
            />
          </div>
  
          {/* Playlist Name Input */}
          <div className='form-group'>
            <label>Playlist Name</label>
            <Form.Control
              type="text"
              placeholder="Enter Playlist Name"
              value={playlistName}
              onChange={e => setPlaylistName(e.target.value)}
            />
          </div>
  
          {/* Owner Name Input */}
          <div className='form-group'>
            <label>Owner Name</label>
            <Form.Control
              type="text"
              placeholder="Enter Owner Name"
              value={ownerName}
              onChange={e => setOwnerName(e.target.value)}
            />
          </div>


          <div className='form-group'>
            <label>Password</label>
            <Form.Control
              type="text"
              placeholder="Enter Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
  

          <button type="submit" className="form-submit-btn" onClick={handleSubmit}>
            Submit
          </button>
          {error && (
            <Alert variant="danger">
              {error}
              {error === 'Missing access token. Please re-login' && 
              (
                  <button  className="form-submit-btn" onClick={handleLogin}>
                  Login
                  </button>
              )}
            </Alert>
          )}
        </div>
    </div>
    </div>
  );
};

export default RejoinForm;
