import React, { useState ,useEffect } from 'react';
import { useContext } from 'react';
import JoinPartyContext from '../contexts/JoinPartyContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddSongDashboard from './AddSongDashboard';
import PlaylistView from './PlaylistView';
import Box from '@mui/material/Box';
import SongLimit from './SongLimit';
import axios from 'axios';
import { responsiveFontSizes } from '@mui/material';
require('dotenv').config()  

const HOST = process.env.REACT_APP_HOST_SERVER
const PartyDashboard = ({userName , partyName }) => {
    const [value, setValue] = React.useState(0);
    
    const { partyDetails } = useContext(JoinPartyContext);
    const { setAccessToken, setPlaylistName, setOwnerName, setPlaylistId } = useContext(JoinPartyContext);
    const { accessToken, playlistName, ownerName, playlistId,setPartyDetails } = useContext(JoinPartyContext);
    const [ songBalanceTrigger, setSongBalanceTrigger ] = useState(false);
    const [songBalance, setSongBalance ] = useState();
    setAccessToken(partyDetails.accessToken);
    setPlaylistName(partyDetails.playlistName);
    setOwnerName(partyDetails.ownerName);

  useEffect(() => {
    setAccessToken(partyDetails.accessToken);
    setPlaylistName(partyDetails.playlistName);
    setOwnerName(partyDetails.ownerName);
    setPlaylistId(partyDetails.playlistId);

  }, [partyDetails, setAccessToken, setPlaylistName, setOwnerName, playlistId, playlistName ]);


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
        console.log(response.data.songBalance); // Log inside the function
        setSongBalance(response.data.songBalance);
        return response.data.songBalance;
      } catch (error) {
        console.log(error);
      }
    };
  
    getSongBalance(); // Call the function
  
  }, [songBalanceTrigger, userName, playlistName, partyName]);
  

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

//   console.log(partyDetails)

  return (
    <div>
      <p style={title_style}> {ownerName}'s Party </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <SongLimit text = {songBalance} />
</div>
      <Box sx={{ width: '100%' }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Playlist" sx={{ color: '#e8e8e8' }} />
          <Tab label="Add Song" sx={{ color: '#e8e8e8' }} />
        </Tabs>
      </Box>

      {value === 0 && <div>
        <PlaylistView accessToken={accessToken} playlistId={playlistId}/>
    </div>
    } 
      {value === 1 && <div>  <AddSongDashboard  songBalanceTrigger = {songBalanceTrigger} setSongBalanceTrigger = {setSongBalanceTrigger} songBalance = {songBalance}  setSongBalance = {setSongBalance} userName = {userName}  playlistName = {playlistName} partyName = {partyName} accessToken = {accessToken} playlistId={ playlistId}/> </div>
      
      } 
    </div>
  );
};



const title_style = {
  color: '#e8e8e8',
  fontWeight: 900,
  fontSize: '4rem',
  fontFamily: 'Montserrat,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"!important',
};
const color_style = { color: '#e8e8e8' };

export default PartyDashboard;
