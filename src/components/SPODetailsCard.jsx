// src/components/SPODetailsCard.jsx
import React from "react";
import { useSingleSPO } from "../hooks/useSingleSPO";
import { Link } from 'react-router-dom';

export default function SPODetailsCard({ authorKey }) {

  const  spo  = useSingleSPO(authorKey);

  if (!spo) return <p>SPO not found.</p>;

  return (
    <div className="overview-section">
      <div className="overview-long" style={{ flex: "0 0 100%" }}>
        <div className="overview-row">
          <div className="card-long">
            <h3>Ticker</h3>
            <p><Link to={`/spo/${authorKey}`}>{spo.Ticker}</Link></p>
          </div>
          <div className="card-long">
            <h3>Stake</h3>
            <p>₳ {spo.Stake?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="card-long">
            <h3>Name</h3>
            <p>{spo.Name}</p>
          </div>
          <div className="card-long">
            <h3>Blocks Produced</h3>
            <p>{spo.blockcount}</p>
          </div>
        </div>

        <div className="overview-row">
          <div className="card-long">
            <h3>Description</h3>
            <p>{spo.Description}</p>
          </div>
        </div>

        <div className="overview-row">
          <div className="card-long">
            <h3>Registration</h3>
            <p>Epoch {spo.CardanoEpoch} / Slot {spo.Slot}</p>
          </div>
          <div className="card-long">
            <h3>Type</h3>
            <p>{spo.Type}</p>
          </div>
          <div className="card-long">
            <h3>Status</h3>
            <p>{spo.IsValid ? "Valid" : "Invalid"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
