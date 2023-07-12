import { RequestHandler } from "express";

export const requestLoggerMiddleware: RequestHandler = (req, _, next) => {
  console.log(req.method, req.path, "-body ", req.body);
  next();
};
