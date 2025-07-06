import React, { useState } from 'react';

export default function PasswordGate({ onAccessGranted }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    const res = await fetch('/api/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: input }),
    });

    res.ok ? onAccessGranted() : setError(true);
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
        {error && (
          <p style={{ color: 'red', marginTop: '10px' }}>Incorrect password</p>
        )}
      </div>
    </div>
  );
}
