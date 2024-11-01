import "reflect-metadata";
import { inject, injectable } from 'tsyringe';
import bcrypt from 'bcryptjs';

import { User } from '../../user/user.model';
import { AuthServiceInterface } from './auth.service.interface';
import { UserRepositoryInterface } from '../../user/repository/user.repository.interface';

@injectable()
export class AuthService implements AuthServiceInterface {
    private readonly saltGenerationRounds: number = 10;

    constructor(@inject("UserRepositoryInterface") private userRepository: UserRepositoryInterface) { }

    public async authenticate(email: string, password: string): Promise<User | null> {
        const user: User | null = await this.userRepository.findUserByEmail(email);

        if (user) {
            const isEqual: boolean = await this.comparePasswords(password, user?.password)
            if (isEqual) return user;
        }

        return null;
    }

    public async changePassword(id: string, email: string, oldPassword: string, newPassword: string): Promise<User | null> {
        const user: User | null = await this.authenticate(email, oldPassword);

        if (user && user.id === id) {
            const hashedNewPassword: string = await this.hashPasswordWithSalt(
                newPassword,
                await this.generateSalt(this.saltGenerationRounds)
            );

            const userWithNewPassword: User | null = await this.userRepository.changeUserPassword(user.id, hashedNewPassword);
            if (userWithNewPassword) return userWithNewPassword;
        }

        return null
    }

    private generateSalt = async (rounds: number): Promise<string> => {
        const salt = await bcrypt.genSalt(rounds);
        return salt;
    }

    private hashPasswordWithSalt = async (password: string, salt: string): Promise<string> => {
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    private comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }
}


