import { LikesPostResponse, Like } from "../../shared";
import { db } from "../dataStore";
import { ExpressHandlerWithParams } from "../types";

export const createLikeHandler: ExpressHandlerWithParams<
  { postId: string },
  null,
  {}
> = async (req, res) => {
  if (!req.params.postId) {
    return res.status(400).send({ error: "Post ID is missing" });
  }

  if (!(await db.getPost(req.params.postId))) {
    return res.status(404).send({ error: "Post not found " });
  }

  const likeExist = await db.exists({
    postId: req.params.postId,
    userId: res.locals.userId,
  });

  if (likeExist) {
    return res.status(400).send({ error: "Duplicate like" });
  }

  const like: Like = {
    postId: req.params.postId,
    userId: res.locals.userId,
  };

  await db.createLike(like);
  return res.sendStatus(200);
};

export const deleteLikeHandler: ExpressHandlerWithParams<
  { postId: string },
  null,
  {}
> = async (req, res) => {
  if (!req.params.postId) {
    return res.status(400).send({ error: "Post ID is missing" });
  }

  if (!(await db.getPost(req.params.postId))) {
    return res.status(404).send({ error: "Post not found " });
  }

  const like: Like = {
    postId: req.params.postId,
    userId: res.locals.userId,
  };

  await db.deleteLike(like);
  return res.sendStatus(200);
};

export const likesPostHandler: ExpressHandlerWithParams<
  { postId: string },
  null,
  LikesPostResponse
> = async (req, res) => {
  if (!req.params.postId) {
    return res.status(400).send({ error: "Post ID is missing" });
  }

  const likes: number = await db.getLikes(req.params.postId);
  return res.send({ likes });
};
