import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from "axios";

const SignUpForm = ({ accessToken, setCreatedPlaylist, setPlaylistId }) => {
  const [partyName, setPartyName] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');


  const createPlaylist = () => {
    console.log({
      playlistName, accessToken, ownerName, partyName, password
    })
    axios
      .post("http://localhost:3001/createplaylist", {
        playlistName, accessToken, ownerName, partyName, password
      })
      .then((res) => {
        const data = res.body;
        setPlaylistId(res.data.playlistEntry.playlistId);
        setPlaylistName(res.data.playlistEntry.playlistName);
        setCreatedPlaylist(true);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          // Handle missing access token
          setError("Missing access token");
        } else  if (err.response && err.response.status === 402)
        {
          setError("Playlist with same credential already exists. Chose different name for your playlist or Rejoin a Party.");
        }
        else  {
          setError("Server error. Contact admin.");         
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPlaylist();
  };

  const handleLogin = () => {
    window.location.href = "http://localhost:3000/login";
  };

  return (
    <div className="center-container">
      <div className='form-container'>
        <div className='form'>
          <div className='form-group'>
            <label>Party Name</label>
            <Form.Control
              type="text"
              placeholder="Enter Party Name"
              value={partyName}
              onChange={e => setPartyName(e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label>Playlist Name</label>
            <Form.Control
              type="text"
              placeholder="Enter Playlist Name"
              value={playlistName}
              onChange={e => setPlaylistName(e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label>Owner Name</label>
            <Form.Control
              type="text"
              placeholder="Enter Owner Name"
              value={ownerName}
              onChange={e => setOwnerName(e.target.value)}
            />


            <div className='form-group'>
            <label>Password</label>
            <Form.Control
              type="text"
              placeholder="Enter Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
  

          </div>
          <button type="submit" className="form-submit-btn" onClick={handleSubmit}>
            Submit
          </button>
          {error && (
            <Alert variant="danger">
              {error}
              {error === "Missing access token" && (


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

export default SignUpForm;
