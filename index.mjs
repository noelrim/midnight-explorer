import express from 'express';
import { createClient } from 'graphql-ws';
import WebSocket from 'ws';

const app = express();
app.use(express.json());

app.post('/collect', async (req, res) => {
  console.log('🚀 Midnight Explorer triggered');

  const stats = { blocks: 0, txs: 0, deploys: 0, updates: 0, calls: 0 };
  const cutoffTime = Date.now() + 1000 * 60 * 3;

  const client = createClient({
    url: 'wss://indexer-rs.testnet-02.midnight.network/api/v1/graphql/ws',
    webSocketImpl: WebSocket,
  });

  let finished = false;

  await new Promise((resolve, reject) => {
    client.subscribe({
      query: `
        subscription {
          blocks {
            timestamp
            transactions {
              contractActions {
                __typename
              }
            }
          }
        }
      `
    }, {
      next: ({ data }) => {
        if (!data?.blocks) return;

        stats.blocks++;
        const txs = data.blocks.transactions || [];
        stats.txs += txs.length;

        for (const tx of txs) {
          for (const action of tx.contractActions || []) {
            switch (action.__typename) {
              case 'ContractDeploy': stats.deploys++; break;
              case 'ContractUpdate': stats.updates++; break;
              case 'ContractCall':   stats.calls++; break;
            }
          }
        }

        if (Date.now() > cutoffTime && !finished) {
          finished = true;
          resolve();
        }
      },
      error: (err) => {
        if (!finished) {
          finished = true;
          reject(err);
        }
      },
      complete: () => {
        if (!finished) {
          finished = true;
          resolve();
        }
      }
    });
  });

  console.log('✅ Done:', stats);
  res.status(200).json({ status: 'ok', ...stats });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Listening on port ${PORT}`);
});
