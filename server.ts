import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Proxy API requests to the insecure backend
  const API_URL = process.env.API_URL || 'http://193.169.63.123:58080';

  app.use('/api', async (req, res) => {
    const targetUrl = `${API_URL}${req.originalUrl}`;
    
    console.log(`[Proxy] ${req.method} ${req.originalUrl} -> ${targetUrl}`);
    try {
      const response = await axios({
        method: req.method,
        url: targetUrl,
        data: req.body,
        headers: {
          ...req.headers,
          host: new URL(API_URL).host,
        },
      });
      console.log(`[Proxy] Success: ${response.status} for ${targetUrl}`);
      res.status(response.status).json(response.data);
    } catch (error: any) {
      console.error(`[Proxy] Error: ${error.message} for ${targetUrl}`);
      if (error.response) {
        console.error(`[Proxy] Response data:`, JSON.stringify(error.response.data));
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: 'Proxy Error' });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
