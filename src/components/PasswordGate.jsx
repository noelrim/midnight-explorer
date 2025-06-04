// src/components/PasswordGate.jsx
import React, { useState } from 'react';

const PASSWORD = process.env.REACT_APP_ACCESS_PASSWORD;

export default function PasswordGate({ onAccessGranted }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {

    e.preventDefault();
    if (input === PASSWORD) {
      onAccessGranted();
    } else {
      setError(true);
    }
  };

  return (
    <div className="container">
      <div className="panel-wrapper">
        <form className="search-bar" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter access password..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Unlock</button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>Incorrect password</p>}
      </div>
    </div>
  );
}
