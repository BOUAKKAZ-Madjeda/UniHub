import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CompleteProfile() {
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add logic for saving profile to Firestore if needed
    navigate('/home');
  };

  return (
    <div>
      <h1>Complete Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display Name"
          required
        />
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default CompleteProfile;
