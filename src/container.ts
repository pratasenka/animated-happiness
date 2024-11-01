import 'reflect-metadata';
import { container } from "tsyringe";

import { ItemServiceInterface } from './items/service/item.service.interface';
import { ItemService } from './items/service/item.service';
import { MarketServiceInterface } from './market/service/market.service.interface';
import { MarketService } from './market/service/market.service';
import { MarketController } from './market/controller/market.controller';
import { ItemController } from './items/controller/item.controller';
import { AuthService } from './auth/service/auth.service';
import { AuthServiceInterface } from './auth/service/auth.service.interface';
import { AuthController } from './auth/controller/auth.controller';
import { UserRepositoryInterface } from './user/repository/user.repository.interface';
import { UserRepository } from './user/repository/user.repository';
import { ItemRepository } from './items/repository/item.repository';
import { ItemRepositoryInterface } from './items/repository/item.repository.interface';

// repositories
container.register<UserRepositoryInterface>('UserRepositoryInterface', {
    useClass: UserRepository
});
container.register<ItemRepositoryInterface>('ItemRepositoryInterface', {
    useClass: ItemRepository
});


// services
container.register<AuthServiceInterface>('AuthServiceInterface', {
    useClass: AuthService
});
container.register<MarketServiceInterface>('MarketServiceInterface', {
    useClass: MarketService
});
container.register<ItemServiceInterface>('ItemServiceInterface', {
    useClass: ItemService
});


// controllers
container.register('AuthController', AuthController);
container.register('MarketController', MarketController);
container.register('ItemController', ItemController);

export { container };