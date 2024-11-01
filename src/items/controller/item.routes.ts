import { Request, Response, Router } from 'express';

import { container } from '../../container';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { buyItemValidation } from './item.middleware';
import { validationCheckingMiddleware } from '../../middlewares/validation-checking.middleware';
import { ItemController } from './item.controller';

const itemRoute: Router = Router();
const itemController = container.resolve(ItemController);

itemRoute.post('/buy',
    authMiddleware,
    buyItemValidation,
    validationCheckingMiddleware,
    (req: Request, res: Response) => itemController.buyItem(req, res)
);

export default itemRoute;