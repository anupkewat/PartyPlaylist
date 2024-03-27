import { DataProvider } from '../contexts/JoinPartyContext';
import React, { useState , useEffect} from 'react';
import PartyDashboard from './PartyDashboard';
import JoinForm from './JoinForm'
const JoinDashboard = () => {


const [joinedParty, setJoinedParty] = useState(false)
const [userName, setUserName] = useState()
 const [partyName, setPartyName] = useState('');
const [playlistName , setPlaylistName] = useState('');
const [code, setCode] = useState(null);

return (
<DataProvider>
   { !joinedParty ?
    <div style={base_styles}>
        <div className="center-container">
        <JoinForm  partyName={partyName} playlistName={playlistName} userName={userName} setPartyName={setPartyName} setPlaylistName={setPlaylistName} 
         setUserName = {setUserName} setJoinedParty={setJoinedParty}  />
        </div>
    </div>
    :
    <>
        <PartyDashboard userName = {userName} partyName={partyName}  />
    </>
}
    </DataProvider>
    
  );
};

const base_styles = { backgroundColor: '#212121', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }

export default JoinDashboard