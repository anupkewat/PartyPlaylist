import { DataProvider } from '../contexts/JoinPartyContext';
import React, { useState } from 'react';
import PartyDashboard from './PartyDashboard';
import JoinForm from './JoinForm'
const JoinDashboard = () => {


const [joinedParty, setJoinedParty] = useState(false)



return (
<DataProvider>
   { !joinedParty ?
    <div style={base_styles}>
        <div className="center-container">
        <JoinForm setJoinedParty={setJoinedParty}  />
        </div>
    </div>
    :
    <>
        <PartyDashboard />
    </>
}
    </DataProvider>
    
  );
};

const base_styles = { backgroundColor: '#212121', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }

export default JoinDashboard