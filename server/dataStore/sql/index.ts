import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

import { Datastore } from "..";
import { User, Post, Like, Comment } from "../../types";
import path from "path";

export class SqlDataStore implements Datastore {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;
  public async openDb() {
    // open the database
    this.db = await open({
      filename: path.join(__dirname, "codersquare.sqlite"),
      driver: sqlite3.Database,
    });

    this.db.run("PRAGMA foreign_keys = ON;");

    await this.db.migrate({
      migrationsPath: path.join(__dirname, "migrations"),
    });

    return this;
  }

  async createUser(user: User): Promise<void> {
    await this.db.run(
      "INSERT INTO users (id, firstName, lastName, username, email, password) VALUES (?,?,?,?,?,?)",
      user.id,
      user.firstName,
      user.lastName,
      user.username,
      user.email,
      user.password
    );
  }

  getUserById(id: string): Promise<User | undefined> {
    return this.db.get<User>("SELECT * FROM users WHERE id = ?", id);
  }

  getUserByUsername(username: string): Promise<User | undefined> {
    return this.db.get<User>(
      "SELECT * FROM users WHERE username = ?",
      username
    );
  }

  getUserByEmail(email: string): Promise<User | undefined> {
    return this.db.get<User>("SELECT * FROM users WHERE email = ?", email);
  }

  listPost(): Promise<Post[]> {
    return this.db.all<Post[]>("SELECT * FROM posts");
  }

  async createPost(post: Post): Promise<void> {
    await this.db.run(
      "INSERT INTO posts (id, title, url, userId, postedAt) VALUES (?,?,?,?,?)",
      post.id,
      post.title,
      post.url,
      post.userId,
      post.postedAt
    );
  }

  getPost(id: string): Promise<Post | undefined> {
    return this.db.get("SELECT * FROM posts WHERE id = ?", id);
  }

  deletePost(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async createLike(like: Like): Promise<void> {
    await this.db.run(
      "INSERT INTO likes (postId, userId) VALUES (?,?)",
      like.postId,
      like.userId
    );
  }

  async deleteLike(like: Like): Promise<void> {
    await this.db.run(
      "DELETE FROM likes WHERE postId = ? AND userId = ?",
      like.postId,
      like.userId
    );
  }

  async getLikes(postId: string): Promise<number> {
    const result = await this.db.get<{ count: number }>(
      "SELECT COUNT(*) as count FROM likes WHERE postId = ?",
      postId
    );
    return result?.count ?? 0;
  }

  async exists(like: Like): Promise<boolean> {
    const exist = await this.db.get<Like>(
      "SELECT * FROM likes WHERE postId = ? AND userId = ?",
      like.postId,
      like.userId
    );
    return exist ? true : false;
  }

  async createComment(comment: Comment): Promise<void> {
    await this.db.run(
      "INSERT INTO comments (id, userId, postId, comment, postedAt) VALUES (?,?,?,?,?)",
      comment.id,
      comment.userId,
      comment.postId,
      comment.comment,
      comment.postedAt
    );
  }

  listComments(postId: string): Promise<Comment[]> {
    return this.db.all<Comment[]>(
      "SELECT * FROM comments WHERE postId = ?",
      postId
    );
  }

  countComments(postId: string): Promise<number> {
    throw new Error("Method not implemented.");
  }

  async getComment(id: string): Promise<Comment | undefined> {
    return await this.db.get("SELECT * FROM comments WHERE id = ?", id);
  }

  async deleteComment(id: string): Promise<void> {
    await this.db.run("DELETE FROM comments WHERE id = ?", id);
  }
}
