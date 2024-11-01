import { Request, Response, Router } from 'express';
import { container } from '../../container';

import { AuthController } from './auth.controller';
import { changePasswordValidation, loginValidation } from './auth.middleware';
import { validationCheckingMiddleware } from '../../middlewares/validation-checking.middleware';
import { authMiddleware } from '../../middlewares/auth.middleware';

const authRoute: Router = Router();
const authController = container.resolve(AuthController);

authRoute.post('/',
    loginValidation,
    validationCheckingMiddleware,
    (req: Request, res: Response) => authController.authenticate(req, res)
);
authRoute.patch('/',
    authMiddleware,
    changePasswordValidation,
    validationCheckingMiddleware,
    (req: Request, res: Response) => authController.changePassword(req, res)
);

export default authRoute;