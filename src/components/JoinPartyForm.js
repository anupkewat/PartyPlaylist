import React, { useState } from 'react';

const JoinPartyForm = ({ joinParty }) => {
  const [partyCode, setPartyCode] = useState('');

  const handlePartyCodeChange = (event) => {
    setPartyCode(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    joinParty(partyCode);
  };

  return (
    <div>
      <h2>Join a Party</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Party Code:
          <input
            type="text"
            value={partyCode}
            onChange={handlePartyCodeChange}
            required
          />
        </label>
        <button type="submit">Join Party</button>
      </form>
    </div>
  );
};

export default JoinPartyForm;
