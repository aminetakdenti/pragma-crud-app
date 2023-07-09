import { randomUUID } from "crypto";
import {
  CreateCommentRequest,
  CreateCommentResponse,
  DeleteCommentRequest,
  DeleteCommentResponse,
  ListCommentRequest,
  ListCommentResponse,
} from "../api";
import { db } from "../dataStore";
import { Comment, ExpressHandler } from "../types";

export const deleteCommentHandler: ExpressHandler<
  DeleteCommentRequest,
  DeleteCommentResponse
> = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.sendStatus(400);
  }

  const existing = await db.getComment(id);
  if (!existing) {
    return res.sendStatus(404);
  }

  await db.deleteComment(id);
  return res.sendStatus(200);
};

export const createCommentHandler: ExpressHandler<
  CreateCommentRequest,
  CreateCommentResponse
> = async (req, res) => {
  const { comment, postId } = req.body;
  if (!comment || !postId) {
    return res.sendStatus(400);
  }

  const newComment: Comment = {
    id: randomUUID(),
    userId: res.locals.userId,
    comment,
    postId,
    postedAt: Date.now(),
  };

  await db.createComment(newComment);
  res.sendStatus(200);
};

export const listCommentHanlder: ExpressHandler<
  ListCommentRequest,
  ListCommentResponse
> = async (req, res) => {
  return res.send({ comments: await db.listComment() });
};
