import { injectable } from 'tsyringe';

import { User } from "../user.model";
import pool from '../../utils/db';
import { UserRepositoryInterface } from './user.repository.interface';

@injectable()
export class UserRepository implements UserRepositoryInterface {
    public async findUserByEmail(email: string): Promise<User> {
        const queryResult: any = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return queryResult.rows[0]
    }

    public async findUserById(id: string): Promise<User> {
        const queryResult: any = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return queryResult.rows[0]
    }

    public async changeUserPassword(id: string, newPassword: string): Promise<any> {
        return pool.query('UPDATE users SET password = $1 WHERE id = $2', [newPassword, id]);
    }
}
