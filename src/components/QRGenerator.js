import React from 'react';
import QRCode from 'react-qr-code';

function QRGenerator( {partyName ,playlistName , password}) {
const REACT_HOST = process.env.REACT_APP_HOST || 'http://localhost:3000'

const link = `${REACT_HOST}/join?party=${partyName}&playlist=${playlistName}&pass=${password}`
console.log(link)


  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', backgroundColor: 'white', borderRadius: '10px', }}>
      <QRCode value={link} size={128} style={{ margin: '40px' }} />
    </div>
  );
}

export default QRGenerator;
