import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap'; // Assuming you are using Bootstrap for styling
import axios from "axios"

const SignUpForm = ({accessToken,setCreatedPlaylist, setPlaylistId}) => {
  const [partyName, setPartyName] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  console.log('@signupform: creating playlist with AT:' ,accessToken)

  const createPlaylist = () =>{

    console.log('@signupform: creating playlist with AT:' ,accessToken)
    
    axios
      .post("http://localhost:3001/createplaylist", {
        playlistName,accessToken,ownerName,partyName
      })
      .then((res)=> {
                


        // axios.post()
        console.log(res)
        const data = res.body


        console.log(`created : ${res.data.playlistEntry}`)
        setPlaylistId(res.data.playlistEntry.playlistId)
        setPlaylistName(res.data.playlistEntry.playlistName)
        setCreatedPlaylist(true)


        

      })
      .catch((err) => { 
        console.log(err)
        // 
        console.log('could not create playlist')
      })
      


  }


  const handleSubmit = (e) => {
    e.preventDefault(); 
    createPlaylist(); 

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
  
          {/* Button to Create Playlist */}
          {/* <Button variant="success" size="lg" type="submit">
            Create Playlist
          </Button> */}
          <button type="submit" className="form-submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
    </div>
    </div>
  );
};

export default SignUpForm;
