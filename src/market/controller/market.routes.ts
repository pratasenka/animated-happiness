import { Request, Response, Router } from 'express';
import { container } from '../../container';

import { MarketController } from './market.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const marketRoute: Router = Router();
const marketController = container.resolve(MarketController);

marketRoute.get('/',
    authMiddleware,
    (req: Request, res: Response) => marketController.getItems(req, res)
);

export default marketRoute;