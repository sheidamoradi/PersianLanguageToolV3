import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes';

const app = express();

// Initialize the app with routes
registerRoutes(app);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}