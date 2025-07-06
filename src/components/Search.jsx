import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Search() {
  const [queryText, setQueryText] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    const trimmed = queryText.trim();

    if (!trimmed) return;

    // Route directly if it's a block height (pure digits)
    if (/^\d+$/.test(trimmed)) {
      navigate(`/block/${trimmed}`);
      return;
    }

    // If 64-char hex: could be SPO or transaction
    if (/^[a-fA-F0-9]{64}$/.test(trimmed)) {
      try {
        const res = await fetch(`/api/spo/get?id=${trimmed}`);
        const spoDoc = await res.json();
        if (spoDoc.exists) {
          navigate(`/spo/${trimmed}`);
        } else {
          navigate(`/transaction/${trimmed}`);
        }
      } catch (err) {
        console.error("Firestore lookup error:", err);
        alert("Error occurred while searching.");
      }
      return;
    }

    alert("Unrecognized input format.");
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by block height, SPO, or transaction hash..."
        value={queryText}
        onChange={(e) => setQueryText(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
