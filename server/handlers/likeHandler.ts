import {
  CreateLikeRequest,
  CreateLikeResponse,
  DeleteLikeRequest,
  DeleteLikeResponse,
} from "../api";
import { db } from "../dataStore";
import { ExpressHandler, Like } from "../types";

export const createLikeHandler: ExpressHandler<
  CreateLikeRequest,
  CreateLikeResponse
> = async (req, res) => {
  const { postId } = req.body;
  if (!postId) {
    return res.sendStatus(400);
  }

  const existing = await db.getPost(postId);
  if (!existing) {
    return res.sendStatus(404);
  }

  const like: Like = {
    userId: res.locals.userId,
    postId,
  };
  db.createLike(like);
  res.sendStatus(200);
};

export const deleteLikeHandler: ExpressHandler<
  DeleteLikeRequest,
  DeleteLikeResponse
> = async (req, res) => {
  const { postId } = req.body;
  const userId = res.locals.userId;
  if (!postId) {
    return res.sendStatus(400);
  }

  const existing =
    (await db.getPost(postId)) && (await db.getLike(postId, userId));
  if (!existing) {
    return res.sendStatus(404);
  }

  db.deleteLike(postId, userId);
  res.sendStatus(200);
};
