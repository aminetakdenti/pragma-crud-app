import { Post, Comment, User } from './types';

// Post APIs
export interface ListPostRequest {}
export interface ListPostResponse {
  posts: Post[];
}

export type CreatePostRequest = Pick<Post, 'title' | 'url'>;
export interface CreatePostResponse {}

export interface GetPostRequest {}
export interface GetPostResponse {
  post: Post;
}

// Comment APIs
export type CreateCommentRequest = Pick<Comment, 'comment' | 'postId'>;
export interface CreateCommentResponse {}

export interface ListCommentsResponse {
  comments: Comment[];
}

export type DeleteCommentResponse = {};

// Like APIs
export interface LikesPostResponse {
  likes: number;
}

// User APIs
export type SignUpRequest = Pick<
  User,
  'email' | 'firstName' | 'lastName' | 'password' | 'userName'
>;
export interface SignUpResponse {
  jwt: string;
}

export interface SignInRequest {
  login: string; // username || email
  password: string;
}
export type SignInResponse = {
  user: Pick<User, 'email' | 'firstName' | 'lastName' | 'id' | 'userName'>;
  jwt: string;
};

export interface GetuserResponse {
  user: Pick<User, 'email' | 'firstName' | 'lastName' | 'id' | 'userName'>;
}

export interface GetCurrentUserRequest {}
export interface GetCurrentUserResponse {
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'userName' | 'email'>;
}

export interface UpdateCurrentUserRequest {
  firstName: string;
  lastName: string;
  username: string;
}
export interface UpdateCurrentUserResponse {}
