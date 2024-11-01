import { AuthService } from './auth.service';
import { UserRepositoryInterface } from '../../user/repository/user.repository.interface';
import bcrypt from 'bcryptjs';
import { User } from '../../user/user.model';

jest.mock('bcryptjs');

describe('AuthService', () => {
    let authService: AuthService;
    let mockUserRepository: jest.Mocked<UserRepositoryInterface>;

    beforeEach(() => {
        mockUserRepository = {
            findUserByEmail: jest.fn(),
            changeUserPassword: jest.fn(),
            findUserById: jest.fn(),
        };
        authService = new AuthService(mockUserRepository);
    });

    describe('authenticate', () => {
        it('should return user if authentication is successful', async () => {
            const user: User = { id: '1', email: 'test@example.com', password: 'hashedpassword', balance: 1000 };
            mockUserRepository.findUserByEmail.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await authService.authenticate('test@example.com', 'password');

            expect(result).toEqual(user);
            expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
            expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
        });

        it('should return null if user is not found', async () => {
            mockUserRepository.findUserByEmail.mockResolvedValue(null);

            const result = await authService.authenticate('test@example.com', 'password');

            expect(result).toBeNull();
            expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
        });

        it('should return null if password does not match', async () => {
            const user: User = { id: '1', email: 'test@example.com', password: 'hashedpassword', balance: 1000 };
            mockUserRepository.findUserByEmail.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const result = await authService.authenticate('test@example.com', 'password');

            expect(result).toBeNull();
            expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
        });
    });

    describe('changePassword', () => {
        it('should return updated user if password change is successful', async () => {
            const user: User = { id: '1', email: 'test@example.com', password: 'oldhashedpassword', balance: 1000 };
            const newHashedPassword = 'newhashedpassword';
            mockUserRepository.findUserByEmail.mockResolvedValue(user);
            mockUserRepository.changeUserPassword.mockResolvedValue({ ...user, password: newHashedPassword });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
            (bcrypt.hash as jest.Mock).mockResolvedValue(newHashedPassword);

            const result = await authService.changePassword('1', 'test@example.com', 'oldpassword', 'newpassword');

            expect(result).toEqual({ ...user, password: newHashedPassword });
            expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 'salt');
            expect(mockUserRepository.changeUserPassword).toHaveBeenCalledWith('1', newHashedPassword);
        });

        it('should return null if authentication fails', async () => {
            mockUserRepository.findUserByEmail.mockResolvedValue(null);

            const result = await authService.changePassword('1', 'test@example.com', 'oldpassword', 'newpassword');

            expect(result).toBeNull();
        });
    });
});