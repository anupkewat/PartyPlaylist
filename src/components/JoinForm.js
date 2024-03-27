import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'
import { useContext, useEffect } from 'react';
import JoinPartyContext from '../contexts/JoinPartyContext';
require('dotenv').config()

const HOST = process.env.REACT_APP_HOST_SERVER




const JoinForm = ({partyName, playlistName, setJoinedParty, userName, setUserName, setPartyName, setPlaylistName}) => {
    const {partyDetails} =  useContext(JoinPartyContext)
    const {setPartyDetails} = useContext(JoinPartyContext)
    const [password, setPassword] = useState('');


    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const partyParam = urlParams.get('party');
      const playlistParam = urlParams.get('playlist');
      const passwordParam = urlParams.get('pass');
      setPartyName(partyParam);
      setPlaylistName(playlistParam);
      setPassword(passwordParam);
      // window.history.pushState({}, document.title, window.location.pathname); //remove the params
    }, []);


    const handleSubmit = async (event) => {
    event.preventDefault();
    const fetchData = async () => {
        console.log('Joining Room...');

        try {
          const response = await axios.get(`${HOST}/joinplaylist`, {
            params: {
              partyName,
              userName,
              playlistName,
              password,
              
            },
          });

          console.log(response)
          if (response.data ){
            console.log('Room Found!')
            setPartyDetails(response.data)
            setJoinedParty(true)
          }

        } catch (error) {
          console.error('Error fetching playlist items:', error);

        }
      };

      fetchData();

    
  };

  return (
    <div className="center-container">
      <div className="form-container">
        <form className="form">
          <div className="form-group">
            <label htmlFor="PartyId">Party </label>
            <input required="" name="PartyId" id="PartyId" type="text"  value ={partyName} onChange={ e=> { setPartyName(e.target.value)}}/>
          </div>
          <div className="form-group">
            <label htmlFor="PartyName">Playlist </label>
            <input required="" name="PartyName" id="PartyName" type="text"  value ={playlistName} onChange={ e=> { setPlaylistName(e.target.value)}}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Secret Code</label>
            <input required="" name="password" id="password" type="password"  value ={password} onChange={ e=> { setPassword(e.target.value)}}/>
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              required
              name="phoneNumber"
              id="phoneNumber"
              type="number" 
              pattern="[0-9]*" 
              placeholder="+91"
              value = {userName}
              onChange ={e => setUserName(e.target.value)}
            />
          </div>

          
          <button type="submit" className="form-submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};



  

export default JoinForm;
