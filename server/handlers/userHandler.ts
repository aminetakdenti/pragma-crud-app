import { pbkdf2Sync, randomUUID } from 'crypto';
import {
  ERRORS,
  GetCurrentUserRequest,
  GetCurrentUserResponse,
  GetuserResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  UpdateCurrentUserRequest,
  UpdateCurrentUserResponse,
  User,
} from '../../shared';
import { db } from '../dataStore';
import { ExpressHandler, ExpressHandlerWithParams } from '../types';
import { signJwt } from '../auth';

export const signInHandler: ExpressHandler<SignInRequest, SignInResponse> = async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return res.sendStatus(400);
  }

  console.log(login);

  const existing = (await db.getUserByEmail(login)) || (await db.getUserByUsername(login));
  if (!existing || existing.password !== hashPassword(password)) {
    return res.sendStatus(403);
  }

  const jwt = signJwt({ userId: existing.id });

  console.log(existing);
  res.status(200).send({
    user: {
      email: existing.email,
      userName: existing.userName,
      firstName: existing.firstName,
      lastName: existing.lastName,
      id: existing.id,
    },
    jwt,
  });
};

export const singUpHandler: ExpressHandler<SignUpRequest, SignUpResponse> = async (req, res) => {
  const { email, userName: userName, firstName, lastName, password } = req.body;
  if (!email || !userName || !firstName || !lastName || !password) {
    return res.status(400).send({ error: 'All fields are requried' });
  }

  const existing = (await db.getUserByEmail(email)) || (await db.getUserByUsername(userName));
  if (existing) {
    return res.status(403).send({ error: 'user already exist' });
  }

  const user: User = {
    id: randomUUID(),
    userName: userName,
    firstName,
    lastName,
    email,
    password: hashPassword(password),
  };
  await db.createUser(user);
  const jwt = signJwt({ userId: user.id });
  return res.status(200).send({ jwt });
};

export const getUser: ExpressHandlerWithParams<{ id: string }, null, GetuserResponse> = async (
  req,
  res
) => {
  if (!req.params.id) {
    return res.sendStatus(400);
  }

  const user = await db.getUserById(req.params.id);

  if (!user) return res.sendStatus(404);

  return res.send({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
    },
  });
};

export const getCurrentUser: ExpressHandler<GetCurrentUserRequest, GetCurrentUserResponse> = async (
  _,
  res
) => {
  const user = await db.getUserById(res.locals.userId);

  if (!user) {
    return res.sendStatus(500);
  }

  return res.send({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
    },
  });
};

export const updateCurrentUser: ExpressHandler<
  UpdateCurrentUserRequest,
  UpdateCurrentUserResponse
> = async (req, res) => {
  const userId = res.locals.userId;
  const { username } = req.body;

  if (username && (await isDuplicateUsername(userId, username))) {
    return res.status(403).send({ error: ERRORS.DUPLICATE_USERNAME });
  }

  const currentUser = await db.getUserById(userId);
  if (!currentUser) {
    return res.status(404).send({ error: ERRORS.USER_NOT_FOUND });
  }

  await db.updateCurrentUser({
    id: userId,
    firstName: req.body.firstName ?? currentUser.firstName,
    lastName: req.body.lastName ?? currentUser.lastName,
    userName: username,
  });
  return res.sendStatus(200);
};

function hashPassword(password: string): string {
  return pbkdf2Sync(password, process.env.SALT!, 42, 64, 'sha512').toString('hex');
}

async function isDuplicateUsername(currentUserId: string, newUsername: string) {
  const userWithProvideUsername = await db.getUserByUsername(newUsername);
  return userWithProvideUsername !== undefined && userWithProvideUsername.id !== currentUserId;
}
