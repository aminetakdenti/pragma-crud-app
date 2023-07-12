import { ErrorRequestHandler } from "express";

export const errHandler: ErrorRequestHandler = (err, _, res) => {
  console.error("Uncought exeption ", err);
  res.status(500).send("Oops, an unexpected occuerd, please try again");
};
