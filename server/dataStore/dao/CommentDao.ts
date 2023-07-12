import { Comment } from "../../../shared";

export interface CommentDao {
  createComment(comment: Comment): Promise<void>;
  listComments(postId: string): Promise<Comment[]>;
  countComments(postId: string): Promise<number>;
  deleteComment(id: string): Promise<void>;
}
