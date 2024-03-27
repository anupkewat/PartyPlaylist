import React from 'react';
import QRCode from 'react-qr-code';

function QRGenerator( {partyName ,playlistName , password}) {
const link = `http://localhost:3000/join?party=${partyName}&playlist=${playlistName}&pass=${password}`
console.log(link)


  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', backgroundColor: 'white', borderRadius: '10px', }}>
      <QRCode value={link} size={128} style={{ margin: '40px' }} />
    </div>
  );
}

export default QRGenerator;
