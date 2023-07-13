import { User } from "../../../shared";

export interface UserDao {
  createUser(user: User): Promise<void>;
  updateCurrentUser(user: Partial<User>): Promise<void>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
}
