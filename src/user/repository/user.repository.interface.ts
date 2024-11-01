import { User } from "../../user/user.model";

export interface UserRepositoryInterface {
    findUserByEmail(email: string): Promise<User | null>;
    findUserById(id: string): Promise<User | null>;
    changeUserPassword(id: string, newPassword: string): Promise<any>;
}