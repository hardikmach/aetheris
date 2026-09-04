import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // DB Path and persistent helpers
  const DB_PATH = path.join(process.cwd(), 'db.json');

  async function getDB() {
    try {
      const data = await fs.readFile(DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Default fallback structure
      return {
        user: {
          totalBalance: 95050.12,
          monthlyGrowth: 12450.00,
          transactionHistory: []
        },
        shipments: []
      };
    }
  }

  async function saveDB(data: any) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Middleware
  app.use(express.json());

  // API Route for real-time market data
  app.get('/api/market-data', async (req, res) => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch from CoinGecko: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching market data:', error);
      res.status(500).json({ error: 'Failed to fetch market data' });
    }
  });

  // API Route to fetch active user data
  app.get('/api/user-data', async (req, res) => {
    try {
      const db = await getDB();
      res.json(db.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Internal system ledger read error' });
    }
  });

  // API Route to deposit funds
  app.post('/api/user-data/deposit', async (req, res) => {
    try {
      const { amount, method } = req.body;
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive numeric value.' });
      }

      const db = await getDB();
      db.user.totalBalance = Number((db.user.totalBalance + amountNum).toFixed(2));
      db.user.monthlyGrowth = Number((db.user.monthlyGrowth + amountNum).toFixed(2));

      const txId = `TX-${Math.floor(1000 + Math.random() * 9000)}-D`;
      const now = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const timestamp = `${months[now.getMonth()]} ${now.getDate()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newTx = {
        id: txId,
        type: 'Deposit',
        method: method || 'Sovereign Automated Clearing',
        amount: amountNum,
        status: 'Completed',
        timestamp
      };

      db.user.transactionHistory.unshift(newTx);
      await saveDB(db);

      res.json({ success: true, user: db.user, tx: newTx });
    } catch (error) {
      console.error('Error executing deposit:', error);
      res.status(500).json({ error: 'Transaction gateway deposition failure' });
    }
  });

  // API Route to withdraw funds
  app.post('/api/user-data/withdraw', async (req, res) => {
    try {
      const { amount, method } = req.body;
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive numeric value.' });
      }

      const db = await getDB();
      if (amountNum > db.user.totalBalance) {
        return res.status(400).json({ error: 'Inadequate liquid collateral to execute withdrawal.' });
      }

      db.user.totalBalance = Number((db.user.totalBalance - amountNum).toFixed(2));
      // Monthly growth is affected inversely, or left unchanged depending on balance sheet defaults
      // Let's reflect actual movement on ledger

      const txId = `TX-${Math.floor(1000 + Math.random() * 9000)}-W`;
      const now = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const timestamp = `${months[now.getMonth()]} ${now.getDate()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newTx = {
        id: txId,
        type: 'Withdraw',
        method: method || 'Secured Dispatch Portal',
        amount: amountNum,
        status: 'Completed',
        timestamp
      };

      db.user.transactionHistory.unshift(newTx);
      await saveDB(db);

      res.json({ success: true, user: db.user, tx: newTx });
    } catch (error) {
      console.error('Error executing withdraw:', error);
      res.status(500).json({ error: 'Transaction gateway withdrawal clearance failure' });
    }
  });

  // API Route to fetch logistical shipments
  app.get('/api/shipments', async (req, res) => {
    try {
      const db = await getDB();
      res.json(db.shipments);
    } catch (error) {
      console.error('Error fetching shipments:', error);
      res.status(500).json({ error: 'Cargo shipment collection load failure' });
    }
  });

  // API Route to register/submit dispute
  app.post('/api/shipments/:id/dispute', async (req, res) => {
    try {
      const { id } = req.params;
      const db = await getDB();
      const shipment = db.shipments.find((s: any) => s.id === id);

      if (!shipment) {
        return res.status(404).json({ error: 'Cargo shipment record not identified.' });
      }

      shipment.chargebackRisk = 'None';
      shipment.status = 'In Transit';
      shipment.confidence = 92;

      await saveDB(db);
      res.json({ success: true, shipments: db.shipments, updatedShipment: shipment });
    } catch (error) {
      console.error('Error resolving cargo dispute:', error);
      res.status(500).json({ error: 'Dispute protocol assignment failure' });
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
