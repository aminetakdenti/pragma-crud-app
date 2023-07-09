import { Comment } from "../../types";

export interface CommentDao {
  createComment(comment: Comment): Promise<void>;
  listComment(): Promise<Comment[]>;
  getCommentById(id: string): Promise<Comment | undefined>;
  deleteComment(id: string): Promise<void>;
}
