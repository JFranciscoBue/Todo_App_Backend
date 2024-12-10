import { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { method, url } = req;

  console.log(`Solicitud de tipo ${method}, a la ruta ${url}`);
  next();
};
