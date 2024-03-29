import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from "axios";
import QRGenerator from "./QRGenerator";

const Settings = ({  partyName, setPartyName, playlistName, setPlaylistName, setCreatedPlaylist,  setPassword, password ,accessToken, setPlaylistId }) => {
  const [ownerName, setOwnerName] = useState('');
  const [error, setError] = useState(null);
  const [interval , setInterval] = useState('')
  const [limit, setLimit] = useState()

  const handleSubmit = (e) => {
    e.preventDefault();
  };


  return (
    <div className="center-container">
      <div className='form-container'>
        <div className='form'>

        <div style = {{display: 'flex' , flexDirection: 'row'}}>
          
          
          {/* <div className='form-group'>
            <label>Reorder Interval (in minutes)</label>
            <Form.Control
              type="number"
              placeholder="Minutes"
              value={interval}
              onChange={e => setInterval(e.target.value)}
            />
          </div> */}

          <div className='form-group ml-10'>
            <label>Song Limit</label>
            <Form.Control
              type="number"
              placeholder="5"
              value={limit}
              onChange={e => setLimit(e.target.value)}
            />
          </div>

           </div>

          <button type="submit" className="form-submit-btn" onClick={handleSubmit}>
            Submit
          </button>

          <QRGenerator
  password={password}
  partyName = {partyName}
  playlistName ={playlistName} />

          {error && (
            <Alert variant="danger">
              {error}
              {error === "Missing access token" && (


                          <button  className="form-submit-btn"
                          
                          >
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

export default Settings;
