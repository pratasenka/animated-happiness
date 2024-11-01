import { Request, Response } from 'express';
import { MarketController } from './market.controller';
import { MarketServiceInterface } from '../service/market.service.interface';
import { MarketResponseItem } from '../dtos/response-item.type';
import { container } from 'tsyringe';
import redisClient from '../../utils/redis';

jest.mock('../../utils/redis', () => ({
    exists: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    expire: jest.fn(),
}));

describe('MarketController', () => {
    let marketService: MarketServiceInterface;
    let marketController: MarketController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let mockSend: jest.Mock;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        marketService = {
            getItems: jest.fn(),
        } as unknown as MarketServiceInterface;

        container.registerInstance("MarketServiceInterface", marketService);
        marketController = container.resolve(MarketController);

        mockSend = jest.fn();
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });

        req = {};
        res = {
            send: mockSend,
            status: mockStatus,
        };

        jest.clearAllMocks();
    });

    describe('getItems', () => {
        it('should return items from cache if available', async () => {
            const cachedItems = JSON.stringify([{
                marketHashName: 'item1',
                currency: 'USD',
                itemPage: 'itemPage1',
                marketPage: 'marketPage1',
                minTradable: 10,
                minNonTradable: null
            }]);
            (redisClient.exists as jest.Mock).mockResolvedValue(true);
            (redisClient.get as jest.Mock).mockResolvedValue(cachedItems);

            await marketController.getItems(req as Request, res as Response);

            expect(redisClient.exists).toHaveBeenCalledWith('marketItems');
            expect(redisClient.get).toHaveBeenCalledWith('marketItems');
            expect(mockSend).toHaveBeenCalledWith(cachedItems);
        });

        it('should fetch items from service if not in cache', async () => {
            const items: MarketResponseItem[] = [{
                marketHashName: 'item1',
                currency: 'USD',
                itemPage: 'itemPage1',
                marketPage: 'marketPage1',
                minTradable: 10,
                minNonTradable: null
            }];
            (redisClient.exists as jest.Mock).mockResolvedValue(false);
            (marketService.getItems as jest.Mock).mockResolvedValue(items);

            await marketController.getItems(req as Request, res as Response);

            expect(redisClient.exists).toHaveBeenCalledWith('marketItems');
            expect(marketService.getItems).toHaveBeenCalled();
            expect(redisClient.set).toHaveBeenCalledWith('marketItems', JSON.stringify(items));
            expect(redisClient.expire).toHaveBeenCalledWith('marketItems', 60);
            expect(mockSend).toHaveBeenCalledWith(items);
        });

        it('should return 500 for server error', async () => {
            (redisClient.exists as jest.Mock).mockRejectedValue(new Error('Server error'));

            await marketController.getItems(req as Request, res as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Server error' });
        });
    });
});