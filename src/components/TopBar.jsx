import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const navigate = useNavigate();

  return (
    <div className="top-bar">
      <div className="top-bar-inner">
        <ul id="menu">
          <li  onClick={() => navigate("/")}>Home</li>
          <li  onClick={() => navigate("/spos")}>SPOs</li>
          <li  onClick={() => navigate("/chainactivity")}>Analytics</li>
        </ul>
        <select className="network-select">
          <option>testnet-02</option>
        </select>
      </div>
    </div>
  );
}