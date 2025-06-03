
import { React, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import REQUEST from "../services/requestService"; 
import { useRecentBlocks } from "../hooks/useRecentBlocks";

export default function Blocks() {


  const blocks = useRecentBlocks();

  if (loading) return <p>Loading block...</p>;
  if (!blocks) return <p>Block not found.</p>;

  // Replace this with actual Firestore or API call to get transaction details
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
            <tr key={block.id}>
              <td>
                <Link to={`/block/${block.BlockHeight}`}>{block.BlockHeight}</Link>
                <br />
                <span className="block-time">{timeAgo(now, block.Timestamp.seconds * 1000)}</span>
              </td>
              <td>{spoMap.get(block.Author) || block.author }</td>
              <td>{block.NumTransactions}</td>
              <td>—</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}