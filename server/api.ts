import { Comment, Post, User, Like } from "./types";

// Post APIs
export interface ListPostRequest {}
export interface ListPostResponse {
  posts: Post[];
}

export type CreatePostRequest = Pick<Post, "title" | "url">;
export interface CreatePostResponse {}

export interface GetPostRequest {}
export interface GetPostResponse {
  post: Post;
}

// Comment APIs
export type CreateCommentRequest = Pick<Comment, "comment" | "postId">;
export interface CreateCommentResponse {}

export interface ListCommentRequest {}
export interface ListCommentResponse {
  comments: Comment[];
}

export interface DeleteCommentRequest {
  id: string;
}
export interface DeleteCommentResponse {}

// Like APIs
export type CreateLikeRequest = Pick<Like, "postId">;
export interface CreateLikeResponse {}

export interface DeleteLikeRequest {
  postId: string;
}
export interface DeleteLikeResponse {}

// User APIs
export type SignUpRequest = Pick<
  User,
  "email" | "firstName" | "lastName" | "password" | "username"
>;
export interface SignUpResponse {
  jwt: string;
}

export interface SignInRequest {
  login: string; // username || email
  password: string;
}
export type SignInResponse = {
  user: Pick<User, "email" | "firstName" | "lastName" | "id" | "username">;
  jwt: string;
};
