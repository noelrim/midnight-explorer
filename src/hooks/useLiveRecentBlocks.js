import { useEffect, useRef, useState } from 'react';
import { createClient } from 'graphql-ws';
import REQUEST from "../services/requestService";

export function useLiveRecentBlocks(deltaFromNow, targetCount = 10, enabled=true) {


  const [blocks, setBlocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const clientRef = useRef(null);
  const startTimeRef = useRef(null);
  let startHeight = null;
useEffect(() => {
  if (!enabled) return;

  const start = async () => {
    try {
      const res = await REQUEST.getLastBlock();
      const height = res?.data?.block?.height;

      if (!height) return;
      deltaFromNow =  (deltaFromNow > 600*3) ? 600*3 : deltaFromNow; 


      const startHeight = height - deltaFromNow;

      const query = `
        subscription {
          blocks(offset: { height: ${startHeight} }) {
            author
            height
            timestamp
            hash
            transactions {
              hash
            }
          }
        }
      `;

      const client = createClient({
        url: 'wss://indexer-rs.testnet-02.midnight.network/api/v1/graphql/ws',
      });

      clientRef.current = client;
      let count = 0;

      const unsubscribe = client.subscribe(
        { query },
        {
          next: ({ data }) => {
            const block = data?.blocks;
            if (!block) return;

            if (count === 0) {
              startTimeRef.current = Date.now();
              console.log(`⏱️ Started receiving blocks from height ${block.height}`);
            }

            count += 1;

            setBlocks(prevBlocks => {
              const updated = [block, ...prevBlocks]
                .sort((a, b) => b.height - a.height)
                .slice(0, 10);
              return updated;
            });

            if (block.transactions?.length > 0) {
              const newTxs = block.transactions.map(tx => ({
                hash: tx.hash,
                blockHeight: block.height,
                timestamp: block.timestamp,
                blockHash: block.hash,
              }));

              setTransactions(prevTxs => {
                const updated = [...newTxs, ...prevTxs]
                  .filter((tx, index, self) =>
                    self.findIndex(t => t.hash === tx.hash) === index
                  )
                  .slice(0, 10);
                return updated;
              });
            }

            if (count === targetCount) {
              const endTime = Date.now();
              const duration = ((endTime - startTimeRef.current) / 1000).toFixed(2);
              console.log(`✅ Received ${targetCount} blocks in ${duration} seconds`);
            }
          },
          error: (err) => {
            console.error('❌ Subscription error:', err);
          },
          complete: () => {
            console.log('✔️ Subscription complete.');
          },
        }
      );

      // Optional: clean up logic if needed
    } catch (err) {
      console.error('Failed to fetch last block:', err);
    }
  };

  start();

  return () => {
    clientRef.current?.dispose?.();
  };
}, [enabled, deltaFromNow, targetCount]);



  return { blocks, transactions };
}
