import { randomUUID } from "crypto";
import {
  CreateCommentRequest,
  CreateCommentResponse,
  DeleteCommentResponse,
  ListCommentsResponse,
} from "../api";
import { db } from "../dataStore";
import { Comment, ExpressHandler, ExpressHandlerWithParams } from "../types";

export const deleteCommentHandler: ExpressHandlerWithParams<
  { id: string },
  null,
  DeleteCommentResponse
> = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send({ error: "Comment ID is missing" });
  }

  await db.deleteComment(req.params.id);
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

export const listCommentHanlder: ExpressHandlerWithParams<
  { postId: string },
  string,
  ListCommentsResponse
> = async (req, res) => {
  if (!req.params.postId) {
    return res.status(400).send({ error: "Post ID is missing" });
  }

  return res.send({ comments: await db.listComments(req.params.postId) });
};
