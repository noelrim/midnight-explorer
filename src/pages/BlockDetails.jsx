
import { React, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import REQUEST from "../services/requestService"; 
import { useBlock } from "../hooks/useBlock";
import { useSPOData } from "../hooks/useSPOData";
import { Link } from 'react-router-dom';
import { timeAgo } from "../utils/time"; // Same here, ensure this function is accessible


export default function BlockDetails() {
  const now = Date.now();

  const { height } = useParams();
  const { block, loading } = useBlock(height);
  const { spoMap, totalAda, numberOfSPOs  } = useSPOData();
  const date = new Date(block?.timestamp);
  if (loading) return <p>Loading block...</p>;
  if (!block) return <p>Block not found.</p>;

  // Replace this with actual Firestore or API call to get transaction details
  return (
 <div className="panel-wrapper"> 
     <div className="overview-section">
      <div className="overview-long" style={{ flex: "0 0 100%" }}>
        <div className="overview-row">
          <div className="card-long">
            <h3>Block Hash</h3>
            <p><span className="label">{block.hash}
            </span></p>
          </div>
          <div className="card-long">
            <h3>Timestamp</h3>
            <p>
             {date.toLocaleString()} at {height}
            </p>
          </div>
        </div>
        <div className="overview-row">
          <div className="card-long">
            <h3>Author</h3>
            <p><Link to={`/spo/${block.author}`}>{spoMap.get(block.author) || block.author}</Link><br/>
              {(spoMap.get(block.author)=="Shielded")? block.author.slice(0,8)+'...':'' }</p>
          </div>
          <div className="card-long">
            <h3>Transactions</h3>
            <p>
              {block.transactions.length}
            </p>
          </div>
        </div>
      </div>
    </div>
   <div className="panel">
        <h3>Transactions</h3>
        <table>
          <thead>
            <tr>
              <th>Tx Hash</th>
              <th>Block</th>
              <th>Output Address</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            {block.transactions.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  Loading transactions...
                </td>
              </tr>
            )}
            {block.transactions.map((t) => (
              <tr key={t.hash}>
                <td>
                  <Link to={`/transaction/${t.hash}`}>{t?.hash?.slice(0, 8)}..{t?.hash?.slice(-4)}</Link>
                  <br />
                  <span className="transaction-time">{timeAgo(now, block.timestamp)}</span>
                </td>
                <td>{block.height}</td>
                <td>{t.OutputAddress || "—"}</td>
                <td>{t.TotalOutput || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>   
  </div>

  );
}