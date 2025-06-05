
import { React, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import REQUEST from "../services/requestService"; 
import { Link } from 'react-router-dom';

import { useTransaction } from "../hooks/useTransaction";

export default function TransactionDetails() {

  const { hash } = useParams();
  const { transaction, loading } = useTransaction(hash);

  const date = new Date(transaction?.block?.timestamp);

  if (loading) return <p>Loading transaction...</p>;
  if (!transaction) return <p>Transaction not found.</p>;

  // Replace this with actual Firestore or API call to get transaction details
  return (
    <div className="panel-wrapper">
     <div className="overview-section">
      <div className="overview-long" style={{ flex: "0 0 100%" }}>
        <div className="overview-row">
          <div className="card-long">
            <h3>Transaction Hash</h3>
            <p><span className="label">{transaction.hash}</span></p>
          </div>
          <div className="card-long">
            <h3>Timestamp</h3>
            <p>
              {new Date(transaction?.block?.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="overview-row">
          <div className="card-long">
            <h3>Block</h3>

            <p><Link to={`/block/${transaction.block.height}`}>${transaction.block.height}</Link></p>
          </div>
          <div className="card-long">
            <h3>Status</h3>
            <p>
              {transaction.applyStage}
            </p>
          </div>
        </div>
        <div className="overview-row">
          <div className="card-long">
            <h3>Merkle Tree Root</h3>
            <p><span className="label">{transaction.merkleTreeRoot}</span></p>
          </div>
          <div className="card-long">
            <h3>Identifiers</h3>
            {transaction.identifiers?.length ? (
              <p>
                {transaction.identifiers.map((t) => (
                  <span className="label" key={t}>{t}</span>
                ))}
              </p>
            ) : (
              <p>None</p>
            )}
          </div>
        </div>
       <div className="overview-row">
          
        </div>
        <div className="overview-row">
          <div className="card-long">
            <h3>Contract actions</h3>
            {transaction.contractActions?.length ? (
              transaction.contractActions.map((c, index) => (
                <div class="contract-action" key={index}>
                  <h4>{c.__typename}</h4>
                  <p>
                    Address:  <span className="label" >{c.address} </span><br />
                    Entry Point:  <span className="label" >{c.entryPoint} </span><br />
                    State: <code>{c.state}</code> <br />
                    Chain State: <code>{c.chainState}</code>
                  </p>
                <hr/>
                </div>
              ))
            ) : (
              <p>None</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}