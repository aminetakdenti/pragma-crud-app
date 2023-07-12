import { pbkdf2Sync, randomUUID } from "crypto";
import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  User,
} from "../../shared";
import { db } from "../dataStore";
import { ExpressHandler } from "../types";
import { signJwt } from "../auth";

export const signInHandler: ExpressHandler<
  SignInRequest,
  SignInResponse
> = async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return res.sendStatus(400);
  }

  const existing =
    (await db.getUserByEmail(login)) || (await db.getUserByUsername(login));
  if (!existing || existing.password !== hashPassword(password)) {
    return res.sendStatus(403);
  }

  const jwt = signJwt({ userId: existing.id });

  res.status(200).send({
    user: {
      email: existing.email,
      firstName: existing.firstName,
      lastName: existing.lastName,
      username: existing.username,
      id: existing.id,
    },
    jwt,
  });
};

export const singUpHandler: ExpressHandler<
  SignUpRequest,
  SignUpResponse
> = async (req, res) => {
  const { email, username, firstName, lastName, password } = req.body;
  if (!email || !username || !firstName || !lastName || !password) {
    return res.status(400).send({ error: "All fields are requried" });
  }

  const existing =
    (await db.getUserByEmail(email)) || (await db.getUserByUsername(username));
  if (existing) {
    return res.status(403).send({ error: "user already exist" });
  }

  const user: User = {
    id: randomUUID(),
    username,
    firstName,
    lastName,
    email,
    password: hashPassword(password),
  };
  await db.createUser(user);
  const jwt = signJwt({ userId: user.id });
  return res.status(200).send({ jwt });
};

function hashPassword(password: string): string {
  return pbkdf2Sync(password, process.env.SALT!, 42, 64, "sha512").toString(
    "hex"
  );
}
