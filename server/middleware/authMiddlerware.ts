import { verifyJwt } from "../auth";
import { db } from "../dataStore";
import { ExpressHandler } from "../types";

export const authMiddlerware: ExpressHandler<any, any> = async (
  req,
  res,
  next
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.sendStatus(201);
  }

  try {
    const payloud = verifyJwt(token);
    console.log(payloud);
    const user = await db.getUserById(payloud.userId);
    if (!user) {
      throw "not found";
    }

    res.locals.userId = user.id;

    next();
  } catch {
    return res.status(401).send({ error: "Bad token" });
  }
};
