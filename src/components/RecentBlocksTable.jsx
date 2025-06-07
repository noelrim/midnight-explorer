import React,  { useEffect, useState, useRef }  from "react";
import { Link } from 'react-router-dom';
import { timeAgo } from "../utils/time"; // Make sure to export timeAgo or define locally
let hasShownInitialDelay = false;

export default function RecentBlocksTable({ blocks, spoMap }) {
  const now = Date.now();
  const [ready, setReady] = useState(false);


    useEffect(() => {
    if (!hasShownInitialDelay) {
      const timer = setTimeout(() => {
        hasShownInitialDelay = true;
        setReady(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else  { setReady(true); }
    }, []);

  return (
    <div className="panel">
      <h2>Recent blocks</h2>
      <table>
        <thead>
          <tr>
            <th>Block</th>
            <th>Pool</th>
            <th>Transactions</th>
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          {!ready || blocks.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                Loading blocks...
              </td>
            </tr>
          ) : (
          blocks.map((b) => (
            <tr key={b.id}>
              <td>
                <Link to={`/block/${b.BlockHeight}`}>{b.height}</Link>
                <br />
                <span className="block-time">{timeAgo(now, b.timestamp)}</span>
              </td>
              <td>
                <Link to={`/spo/${b.author}`}>{spoMap.get(b.author) || b.author}</Link>
             </td>
              <td>{b.transactions?.length}</td>
              <td>—</td>
            </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
