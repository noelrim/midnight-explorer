import express from 'express';
import { createClient } from 'graphql-ws';
import WebSocket from 'ws';

const app = express();
app.use(express.json());

function getLocalHourKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  return `${y}-${m}-${d}T${h}`; // e.g., "2025-05-30T22"
}

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

  const currentLocalHourKey = getLocalHourKey(); // capture once per run

  await new Promise((resolve, reject) => {
    client.subscribe({ query }, {
      next: ({ data }) => {
        if (!data?.blocks || finished) return;

        const block = data.blocks;
        const blockTime = new Date(block.timestamp);
        const blockHourKey = getLocalHourKey(blockTime);

        // 🛑 Skip current local hour (only log completed hours)
        if (blockHourKey === currentLocalHourKey && !finished) {
          console.log(`⏹️ Block from current hour (${blockHourKey}) detected. Stopping.`);
          finished = true;
          clearTimeout(fallbackTimeout);
          resolve();
          return;
        }

        lastHeight = block.height;

        // Update totals
        stats.blocks++;
        const txs = block.transactions || [];
        stats.txs += txs.length;

        // Update per-hour breakdown
        if (!breakdown[blockHourKey]) {
          breakdown[blockHourKey] = {
            blocks: 0,
            txs: 0,
            deploys: 0,
            updates: 0,
            calls: 0,
            lastHeight: block.height
          };
        }

        breakdown[blockHourKey].blocks++;
        breakdown[blockHourKey].txs += txs.length;
        breakdown[blockHourKey].lastHeight = block.height;

        for (const tx of txs) {
          for (const action of tx.contractActions || []) {
            switch (action.__typename) {
              case 'ContractDeploy':
                stats.deploys++;
                breakdown[blockHourKey].deploys++;
                break;
              case 'ContractUpdate':
                stats.updates++;
                breakdown[blockHourKey].updates++;
                break;
              case 'ContractCall':
                stats.calls++;
                breakdown[blockHourKey].calls++;
                break;
            }
          }
        }

        // Optionally stop if block is too new
        if (blockTime.getTime() >= requestStartTime && !finished) {
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
