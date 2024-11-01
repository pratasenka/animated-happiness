import { Request, Response } from 'express';
import { ItemController } from './item.controller';
import { ItemServiceInterface } from '../service/item.service.interface';
import { container } from 'tsyringe';
import { Session, SessionData } from 'express-session';

describe('ItemController', () => {
    let itemService: ItemServiceInterface;
    let itemController: ItemController;
    let req: Partial<Request & { session: Session & Partial<SessionData> }>;
    let res: Partial<Response>;
    let mockSend: jest.Mock;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        itemService = {
            buyItem: jest.fn(),
        } as unknown as ItemServiceInterface;

        container.registerInstance("ItemServiceInterface", itemService);
        itemController = container.resolve(ItemController);

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

    describe('buyItem', () => {
        it('should buy item and return money left', async () => {
            const moneyLeft = 50;
            (itemService.buyItem as jest.Mock).mockResolvedValue(moneyLeft);

            req.body = { itemId: 'item1' };
            if (req.session) req.session.userId = 'user1';

            await itemController.buyItem(req as Request, res as Response);

            expect(itemService.buyItem).toHaveBeenCalledWith('item1', 'user1');
            expect(mockSend).toHaveBeenCalledWith(moneyLeft);
        });

        it('should return 401 if user is not authenticated', async () => {
            req.body = { itemId: 'item1' };

            await itemController.buyItem(req as Request, res as Response);

            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Unauthorized' });
        });

        it('should return 500 for server error', async () => {
            (itemService.buyItem as jest.Mock).mockRejectedValue(new Error('Server error'));

            req.body = { itemId: 'item1' };
            if (req.session) req.session.userId = 'user1';

            await itemController.buyItem(req as Request, res as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Server error' });
        });
    });
});