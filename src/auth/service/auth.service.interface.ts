import { User } from "../../user/user.model";

export interface AuthServiceInterface {
    authenticate(email: string, password: string): Promise<User | null>;
    changePassword(id: string, email: string, oldPassword: string, newPassword: string): Promise<User | null>;
}