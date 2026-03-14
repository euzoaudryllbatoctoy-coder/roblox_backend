import { Request, Response, NextFunction } from 'express';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const providedApiKey = req.header('X-API-Key');
  const expectedApiKey = process.env.SECRET_API_KEY;

  if (!expectedApiKey || providedApiKey !== expectedApiKey) {
    return res.status(403).json({ message: 'Invalid API Key.' });
  }

  next();
};