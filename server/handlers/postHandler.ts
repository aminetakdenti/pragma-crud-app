import { randomUUID } from "crypto";
import { db } from "../dataStore";
import { ExpressHandler, Post } from "../types";
import {
  CreatePostRequest,
  CreatePostResponse,
  ListPostRequest,
  ListPostResponse,
} from "../api";

export const listPostHandler: ExpressHandler<
  ListPostRequest,
  ListPostResponse
> = async (req, res) => {
  res.send({ posts: await db.listPost() });
};

export const createPostHandler: ExpressHandler<
  CreatePostRequest,
  CreatePostResponse
> = async (req, res) => {
  if (!req.body.title || !req.body.url) {
    return res.sendStatus(400);
  }

  // TODO: validate user exist
  // TODO: get user id from session
  // TODO: validate title and url is non-empty
  // TODO: validate url is new, otherwise add +1 to existing post
  const post: Post = {
    id: randomUUID(),
    postedAt: Date.now(),
    title: req.body.title,
    url: req.body.url,
    userId: res.locals.userId,
  };
  await db.createPost(post);
  res.sendStatus(200);
};
