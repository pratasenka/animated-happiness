import { Router } from 'express';

import marketRoute from './market/controller/market.routes';
import itemRoute from './items/controller/item.routes';
import authRoute from './auth/controller/auth.routes';

const routes: Router = Router();

routes.use('/auth', authRoute);
routes.use('/market', marketRoute);
routes.use('/items', itemRoute);

export { routes };