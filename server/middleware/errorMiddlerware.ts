import { ErrorRequestHandler } from "express";

export const errHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("Uncought exeption ", err);
  res.status(500).send("Oops, an unexpected occuerd, please try again");
};
