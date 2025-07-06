import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTransaction } from "../hooks/useTransaction";

export default function TransactionDetails() {
  const { hash } = useParams();
  const { transaction, loading } = useTransaction(hash);
  const [decodedTx, setDecodedTx] = useState(null);

  useEffect(() => {
    async function decodeTx() {
      if (transaction?.raw) {
        const rawResponse = await fetch('/api/transaction/deserialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ txHex: transaction.raw })
        });
        const response = await rawResponse.json();


        if (response?.transaction) {
          setDecodedTx(response.transaction)  ;
        } else {
          console.warn("Failed to decode transaction:", response?.error || "Unknown error");
        }
      }
    }
    decodeTx();
  }, [transaction?.raw]);

  if (loading) return <p>Loading transaction...</p>;
  if (!transaction) return <p>Transaction not found.</p>;

  return (
    <div className={`panel-wrapper`}>
      <div className="overview-section">
        <div className="overview-long" style={{ flex: "0 0 100%" }}>
          <div className="overview-row">
            <div className="card-long">
              <h3>Transaction Hash</h3>
              <p><span className="label">{transaction.hash}</span></p>
            </div>
            <div className="card-long">
              <h3>Timestamp</h3>
              <p>{new Date(transaction?.block?.timestamp).toLocaleString()}</p>
            </div>
          </div>
          <div className="overview-row">
            <div className="card-long">
              <h3>Block</h3>
              <p><Link to={`/block/${transaction.block.height}`}>${transaction.block.height}</Link></p>
            </div>
            <div className={`card-long ${transaction.applyStage}`}>
              <h3>Status</h3>
              <p>{transaction.applyStage}</p>
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
                <p>{transaction.identifiers.map((t) => (
                  <span className="label" key={t}>{t}</span>
                ))}</p>
              ) : (
                <p>None</p>
              )}
            </div>
          </div>
          <div className="overview-row">
            <div className="card-long">
              <h3>Guaranteed coins offer</h3>

                  {decodedTx ? (
                    <>
                      <table className="inputs-outputs">
                        <thead>
                          <tr>
                            <th>Inputs</th>
                            <th>Outputs</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              {decodedTx.inputs?.length ? (
                                <ul className="no-bullet">
                                  {decodedTx.inputs.map((input, idx) => (
                                    <li key={idx}>
                                      <span className="label-head">{input.type}</span><span className="label"> {input.value}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>None</p>
                              )}
                            </td>
                            <td className="border-left">
                              {decodedTx.outputs?.length ? (
                                <ul className="no-bullet">
                                  {decodedTx.outputs.map((output, idx) => (
                                    <li key={idx}>
                                      <span className="label-head">{output.type}</span><span className="label"> {output.value}</span> 
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>None</p>
                              )}
                            </td>
                          </tr>
                                            </tbody>
                      </table>   
                      <div style={{width:"100%", textAlign:"left"}}> 
                         <h4> Deltas</h4>
                        {decodedTx.deltas?.length ? (
                         
                          <ul className="no-bullet">
                            {decodedTx.deltas.map((delta, idx) => (
                              <li key={idx}>
                                <span className="label-head">Token Type</span><span className="label">{delta.TokenType}</span> → <strong>{delta.value}</strong>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>None</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <p>Waiting for decoded transaction...</p>
                  )}
             
            </div>
          </div>
          <div className="overview-row">
            <div className="card-long">              
              <h3 style={{ display: "block", float: "left" }}>Contract actions</h3>
              {transaction.contractActions?.length ? (
                transaction.contractActions.map((c, index) => (
                  <div className="contract-action" key={index}>
                    <h4>{c.__typename}</h4>
                    <p>
                      {c.address && <> <span className="label-head">Address</span><span className="label">{c.address}</span><br /></>}
                      {c.entryPoint && <>  <span className="label-head">Entry Point</span><span className="label">{c.entryPoint}</span><br /></>}
                      {c.state && <> <span className="label-head">State</span><code>{c.state}</code><br /></>}
                      {c.chainState && <> <span className="label-head">Chain State</span><code>{c.chainState}</code></>}
                    </p>
                    <hr />
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
