import React, { useState ,useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useContext } from 'react';
import JoinPartyContext from '../contexts/JoinPartyContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PlaylistView from './PlaylistView';
import Box from '@mui/material/Box';

const PartyDashboard = () => {
    const [value, setValue] = React.useState(0);
    
    const { partyDetails } = useContext(JoinPartyContext);
    const { setAccessToken, setPlaylistName, setOwnerName, setPlaylistId } = useContext(JoinPartyContext);
    const { accessToken, playlistName, ownerName, playlistId,setPartyDetails } = useContext(JoinPartyContext);
    setAccessToken(partyDetails.accessToken);
    setPlaylistName(partyDetails.playlistName);
    setOwnerName(partyDetails.ownerName);

  useEffect(() => {
    setAccessToken(partyDetails.accessToken);
    setPlaylistName(partyDetails.playlistName);
    setOwnerName(partyDetails.ownerName);
    setPlaylistId(partyDetails.playlistId);

  }, [partyDetails, setAccessToken, setPlaylistName, setOwnerName, playlistId, playlistName ]);




  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

//   console.log(partyDetails)

  return (
    <div>
      <p style={title_style}>Welcome to {playlistName} !!</p>
      <Box sx={{ width: '100%' }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Playlist" sx={{ color: '#e8e8e8' }} />
          <Tab label="Add Song" sx={{ color: '#e8e8e8' }} />
        </Tabs>
      </Box>

      {value === 0 && <div>
        <PlaylistView accessToken={accessToken} playlistId={playlistId}/>
    </div>} 
      {value === 1 && <AddSongTab />} {/* Render AddSongTab component when value is 1 */}
    </div>
  );
};

const QueueTab = () => {
  return <div>
    



  </div>;
};

const AddSongTab = () => {
  return <div>Add Song Tab Content</div>;
};

const title_style = {
  color: '#e8e8e8',
  fontWeight: 900,
  fontSize: '5rem',
  fontFamily: 'Montserrat,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"!important',
};
const color_style = { color: '#e8e8e8' };

export default PartyDashboard;
