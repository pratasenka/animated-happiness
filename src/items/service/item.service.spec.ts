import { ItemService } from './item.service';
import { ItemRepositoryInterface } from '../repository/item.repository.interface';

describe('ItemService', () => {
    let itemService: ItemService;
    let mockItemRepository: jest.Mocked<ItemRepositoryInterface>;

    beforeEach(() => {
        mockItemRepository = {
            buyItem: jest.fn(),
        };
        itemService = new ItemService(mockItemRepository);
    });

    describe('buyItem', () => {
        it('should return the remaining user money when purchase is successful', async () => {
            const itemId = '1';
            const userId = 'user1';
            const remainingMoney = 100;

            mockItemRepository.buyItem.mockResolvedValue(remainingMoney);

            const result = await itemService.buyItem(itemId, userId);

            expect(result).toBe(remainingMoney);
            expect(mockItemRepository.buyItem).toHaveBeenCalledWith(itemId, userId);
        });

        it('should throw an error when purchase fails', async () => {
            const itemId = '1';
            const userId = 'user1';

            mockItemRepository.buyItem.mockResolvedValue(null);

            await expect(itemService.buyItem(itemId, userId)).rejects.toThrow('Something went wrong');

            expect(mockItemRepository.buyItem).toHaveBeenCalledWith(itemId, userId);
        });
    });
});