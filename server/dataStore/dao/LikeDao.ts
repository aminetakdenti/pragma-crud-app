import { Like } from "../../types";

export interface LikeDao {
  createLike(like: Like): Promise<void>;
  getLike(postId: string, userId: string): Promise<Like | undefined>;
  deleteLike(postId: string, userId: string): Promise<void>;
}
