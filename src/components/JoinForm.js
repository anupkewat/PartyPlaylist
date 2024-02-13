import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'
import { useContext } from 'react';
import JoinPartyContext from '../contexts/JoinPartyContext';




const JoinForm = ({setJoinedParty}) => {
    const {partyDetails} =  useContext(JoinPartyContext)
    const {setPartyDetails} = useContext(JoinPartyContext)

    const [partyName, setPartyName] = useState('');
    const [userName , setuserName] = useState('');

    const handleSubmit = async (event) => {
    event.preventDefault();
    const fetchData = async () => {
        console.log('Joining Room...');

        try {
          const response = await axios.get('http://localhost:3001/joinplaylist', {
            params: {
              partyName,
              userName,
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
            <label htmlFor="PartyId">Secret Code</label>
            <input required="" name="PartyId" id="PartyId" type="text"  value ={partyName} onChange={ e=> { setPartyName(e.target.value)}}/>
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
              onChange ={e => setuserName(e.target.value)}
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