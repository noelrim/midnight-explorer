import React from "react";
import { Link } from 'react-router-dom';
import { timeAgo } from "../utils/time"; // Make sure to export timeAgo or define locally

export default function RecentBlocksTable({ blocks, spoMap }) {
  const now = Date.now();

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
          {blocks.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                Loading blocks...
              </td>
            </tr>
          )}
          {blocks.map((b) => (
            <tr key={b.id}>
              <td>
                <Link to={`/block/${b.BlockHeight}`}>{b.BlockHeight}</Link>
                <br />
                <span className="block-time">{timeAgo(now, b.Timestamp.seconds * 1000)}</span>
              </td>
              <td>
                <Link to={`/spo/${b.Author}`}>{spoMap.get(b.Author) || b.Author}</Link>
             </td>
              <td>{b.NumTransactions}</td>
              <td>—</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
