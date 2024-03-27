import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import './styles.css'; // Import the CSS file where the styles are defined

const SongLimit = ({ text  = 0 }) => {
  return (
    <div className="rounded-box" >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FontAwesomeIcon icon={faMusic} style={{ color: 'white', marginRight: '5px' }} />
        <span style={{ color: 'white' }}>{text}</span>
      </div>
    </div>
  );
}

export default SongLimit;
