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
    <div>
      <Form onSubmit={handleSubmit}>
        {/* Party Name Input */}
        <Form.Group controlId="partyName">
          <Form.Label>Party Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Party Name"
            value={partyName}
            onChange={e => setPartyName(e.target.value)}
          />
        </Form.Group>

        {/* Playlist Name Input */}
        <Form.Group controlId="playlistName">
          <Form.Label>Playlist Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Playlist Name"
            value={playlistName}
            onChange={e => setPlaylistName(e.target.value)}
          />
        </Form.Group>

        {/* Owner Name Input */}
        <Form.Group controlId="ownerName">
          <Form.Label>Owner Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Owner Name"
            value={ownerName}
            onChange={e => setOwnerName(e.target.value)}
          />
        </Form.Group>

        {/* Button to Create Playlist */}
        <Button variant="success" size="lg" type="submit">
          Create Playlist
        </Button>
      </Form>
    </div>
  );
};

export default SignUpForm;
