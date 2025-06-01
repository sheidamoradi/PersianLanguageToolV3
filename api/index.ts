import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let isInitialized = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isInitialized) {
    try {
      await registerRoutes(app);
      isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize routes:', error);
      return res.status(500).json({ error: 'Server initialization failed' });
    }
  }
  
  app(req as any, res as any);
}