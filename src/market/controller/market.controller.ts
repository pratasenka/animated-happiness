import "reflect-metadata"
import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';

import { MarketServiceInterface } from '../service/market.service.interface';
import { MarketResponseItem } from '../dtos/response-item.type';
import redisClient from '../../utils/redis';

@injectable()
export class MarketController {
    constructor(@inject("MarketServiceInterface") private marketService: MarketServiceInterface) { }

    public async getItems(req: Request, res: Response) {
        try {
            if (await redisClient.exists('marketItems')) {
                res.send(await redisClient.get('marketItems'));
                return;
            }
            const mappedItems: MarketResponseItem[] = await this.marketService.getItems();

            await redisClient.set('marketItems', JSON.stringify(mappedItems));
            await redisClient.expire('marketItems', 60);

            res.send(mappedItems);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
