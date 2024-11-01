import { Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthServiceInterface } from '../service/auth.service.interface';
import { User } from '../../user/user.model';
import { container } from 'tsyringe';
import { Session, SessionData } from 'express-session';

describe('AuthController', () => {
    let authService: AuthServiceInterface;
    let authController: AuthController;
    let req: Partial<Request & { session: Session & Partial<SessionData> }>;
    let res: Partial<Response>;
    let mockSend: jest.Mock;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        authService = {
            authenticate: jest.fn(),
            changePassword: jest.fn(),
        } as unknown as AuthServiceInterface;

        container.registerInstance("AuthServiceInterface", authService);
        authController = container.resolve(AuthController);

        mockSend = jest.fn();
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });

        req = {
            body: {},
            session: {} as Session & Partial<SessionData>,
        };
        res = {
            send: mockSend,
            status: mockStatus,
        };
    });

    describe('authenticate', () => {
        it('should authenticate user and set session', async () => {
            const user: User = { id: '1', email: 'test@example.com', password: 'hashedpassword', balance: 1000 };
            (authService.authenticate as jest.Mock).mockResolvedValue(user);

            req.body = { email: 'test@example.com', password: 'password' };

            await authController.authenticate(req as Request, res as Response);

            expect(authService.authenticate).toHaveBeenCalledWith('test@example.com', 'password');
            expect(req.session?.authorized).toBe(true);
            expect(req.session?.userId).toBe(user.id);
            expect(mockSend).toHaveBeenCalledWith('ok');
        });

        it('should return 403 for bad credentials', async () => {
            (authService.authenticate as jest.Mock).mockResolvedValue(null);

            req.body = { email: 'test@example.com', password: 'wrongpassword' };

            await authController.authenticate(req as Request, res as Response);

            expect(authService.authenticate).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
            expect(mockStatus).toHaveBeenCalledWith(403);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Bad credentials' });
        });

        it('should return 500 for server error', async () => {
            (authService.authenticate as jest.Mock).mockRejectedValue(new Error('Server error'));

            req.body = { email: 'test@example.com', password: 'password' };

            await authController.authenticate(req as Request, res as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Server error' });
        });
    });

    describe('changePassword', () => {
        it('should change password and return ok', async () => {
            const user: User = { id: '1', email: 'test@example.com', password: 'hashedpassword', balance: 1000 };
            (authService.changePassword as jest.Mock).mockResolvedValue(user);

            req.body = { email: 'test@example.com', oldPassword: 'oldpassword', newPassword: 'newpassword' };
            if (req.session) req.session.userId = '1';

            await authController.changePassword(req as Request, res as Response);

            expect(authService.changePassword).toHaveBeenCalledWith('1', 'test@example.com', 'oldpassword', 'newpassword');
            expect(mockSend).toHaveBeenCalledWith('ok');
        });

        it('should return 401 if user is not authenticated', async () => {
            req.body = { email: 'test@example.com', oldPassword: 'oldpassword', newPassword: 'newpassword' };

            await authController.changePassword(req as Request, res as Response);

            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Unauthorized' });
        });

        it('should return 403 for bad credentials', async () => {
            (authService.changePassword as jest.Mock).mockResolvedValue(null);

            req.body = { email: 'test@example.com', oldPassword: 'oldpassword', newPassword: 'newpassword' };
            if (req.session) req.session.userId = '1';

            await authController.changePassword(req as Request, res as Response);

            expect(authService.changePassword).toHaveBeenCalledWith('1', 'test@example.com', 'oldpassword', 'newpassword');
            expect(mockStatus).toHaveBeenCalledWith(403);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Bad credentials' });
        });

        it('should return 500 for server error', async () => {
            (authService.changePassword as jest.Mock).mockRejectedValue(new Error('Server error'));

            req.body = { email: 'test@example.com', oldPassword: 'oldpassword', newPassword: 'newpassword' };
            if (req.session) req.session.userId = '1';

            await authController.changePassword(req as Request, res as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Server error' });
        });
    });
});