import "reflect-metadata"
import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';

import { User } from '../../user/user.model';
import { AuthServiceInterface } from '../service/auth.service.interface';

@injectable()
export class AuthController {
    constructor(@inject("AuthServiceInterface") private authService: AuthServiceInterface) { }

    public async authenticate(req: Request, res: Response) {
        try {
            const { email, password }: { email: string, password: string } = req.body;
            const user: User | null = await this.authService.authenticate(email, password);

            if (user) {
                req.session.authorized = true;
                req.session.userId = user.id;
                res.send('ok');
            }
            else res.status(403).json({ message: 'Bad credentials' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    public async changePassword(req: Request, res: Response) {
        try {
            const { email, oldPassword, newPassword }: {
                email: string,
                oldPassword: string,
                newPassword: string,
            } = req.body;

            if (req.session.userId) {
                const userId: string = req.session.userId;

                const user: User | null = await this.authService.changePassword(userId, email, oldPassword, newPassword);

                if (user) res.send('ok')
                else res.status(403).json({ message: 'Bad credentials' });
            } else res.status(401).json({ message: 'Unauthorized' });

        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
