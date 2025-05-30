import express from 'express';
import { createClient } from 'graphql-ws';
import WebSocket from 'ws';

const app = express();
app.use(express.json());

app.post('/collect', async (req, res) => {
  console.log('🚀 Midnight Explorer triggered');

  const stats = { blocks: 0, txs: 0, deploys: 0, updates: 0, calls: 0 };
  const breakdown = {}; // keyed by 'YYYY-MM-DDTHH'
  let lastHeight = null;

  const requestStartTime = Date.now();
  const startHeight = req.body?.startHeight;
  const offsetClause = startHeight ? `(offset: { height: ${startHeight} })` : '';

  const query = `
    subscription {
      blocks${offsetClause} {
        height
        timestamp
        transactions {
          contractActions {
            __typename
          }
        }
      }
    }
  `;

  const client = createClient({
    url: 'wss://indexer-rs.testnet-02.midnight.network/api/v1/graphql/ws',
    webSocketImpl: WebSocket,
  });

  let finished = false;

  // fallback timeout after 3 minutes
  const fallbackTimeout = setTimeout(() => {
    if (!finished) {
      finished = true;
      console.warn('⏱️ Fallback timeout hit');
      res.status(200).json({
        status: 'timeout',
        startHeight,
        lastHeight,
        ...stats,
        breakdown
      });
    }
  }, 1000 * 60 * 3);

  await new Promise((resolve, reject) => {
    client.subscribe({ query }, {
      next: ({ data }) => {
        if (!data?.blocks || finished) return;

        const block = data.blocks;
        const blockTime = new Date(block.timestamp).getTime();
        const hourKey = new Date(block.timestamp).toISOString().slice(0, 13); // 'YYYY-MM-DDTHH'
        lastHeight = block.height;

        // Update totals
        stats.blocks++;
        const txs = block.transactions || [];
        stats.txs += txs.length;

        // Update per-hour breakdown
        if (!breakdown[hourKey]) {
          breakdown[hourKey] = {
            blocks: 0,
            txs: 0,
            deploys: 0,
            updates: 0,
            calls: 0,
            lastHeight: block.height
          };
        }

        breakdown[hourKey].blocks++;
        breakdown[hourKey].txs += txs.length;
        breakdown[hourKey].lastHeight = block.height;

        for (const tx of txs) {
          for (const action of tx.contractActions || []) {
            switch (action.__typename) {
              case 'ContractDeploy':
                stats.deploys++;
                breakdown[hourKey].deploys++;
                break;
              case 'ContractUpdate':
                stats.updates++;
                breakdown[hourKey].updates++;
                break;
              case 'ContractCall':
                stats.calls++;
                breakdown[hourKey].calls++;
                break;
            }
          }
        }

        if (blockTime >= requestStartTime && !finished) {
          finished = true;
          clearTimeout(fallbackTimeout);
          resolve();
        }
      },
      error: (err) => {
        if (!finished) {
          finished = true;
          clearTimeout(fallbackTimeout);
          reject(err);
        }
      },
      complete: () => {
        if (!finished) {
          finished = true;
          clearTimeout(fallbackTimeout);
          resolve();
        }
      }
    });
  });

  console.log('✅ Done:', stats);
  if (!res.headersSent) {
    res.status(200).json({
      status: 'ok',
      startHeight,
      lastHeight,
      ...stats,
      breakdown
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Listening on port ${PORT}`);
});
