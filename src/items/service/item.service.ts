import "reflect-metadata";
import { inject, injectable } from 'tsyringe';

import { ItemServiceInterface } from './item.service.interface';
import { ItemRepositoryInterface } from '../repository/item.repository.interface';


@injectable()
export class ItemService implements ItemServiceInterface {

    constructor(@inject("ItemRepositoryInterface") private itemService: ItemRepositoryInterface) { }

    public async buyItem(itemId: string, userId: string): Promise<number> {
        const userMoneyLeft: number | null = await this.itemService.buyItem(itemId, userId);

        if (userMoneyLeft !== null) return userMoneyLeft;
        throw new Error('Something went wrong');
    }
}