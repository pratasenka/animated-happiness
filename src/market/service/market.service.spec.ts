import 'reflect-metadata';
import axios from 'axios';
import { MarketService } from './market.service';
import { MarketSkinportItem } from '../dtos/skinport-item.type';
import { MarketResponseItem } from '../dtos/response-item.type';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MarketService', () => {
    let marketService: MarketService;

    beforeEach(() => {
        marketService = new MarketService();
    });

    it('should mock axios GET request', async () => {
        const onlyTreadable = true;
        const mockResponse: MarketSkinportItem[] = [
            { market_hash_name: 'Item 1', currency: 'USD', suggested_price: 12, item_page: 'url1', market_page: 'url2', min_price: 10, max_price: 15, mean_price: 12, median_price: 11, quantity: 5, created_at: 1620000000, updated_at: 1620000000 },
            { market_hash_name: 'Item 2', currency: 'USD', suggested_price: 22, item_page: 'url3', market_page: 'url4', min_price: 20, max_price: 25, mean_price: 22, median_price: 21, quantity: 3, created_at: 1620000000, updated_at: 1620000000 },
        ];

        mockedAxios.get.mockResolvedValue({ data: mockResponse, status: 200, headers: { x: 'x ' }, statusText: 'ok', config: { url: '' } });

        const response = await axios.get<MarketSkinportItem[]>('https://api.skinport.com/v1/items', {
            params: { tradable: onlyTreadable ? 1 : 0 }
        });

        expect(response.data).toEqual(mockResponse);
        expect(mockedAxios.get).toHaveBeenCalledWith('https://api.skinport.com/v1/items', {
            params: { tradable: onlyTreadable ? 1 : 0 }
        });
    });

    it('should fetch and convert items correctly', async () => {
        const tradableItems: MarketSkinportItem[] = [
            { market_hash_name: 'Item 1', currency: 'USD', suggested_price: 12, item_page: 'url1', market_page: 'url2', min_price: 10, max_price: 15, mean_price: 12, median_price: 11, quantity: 5, created_at: 1620000000, updated_at: 1620000000 },
            { market_hash_name: 'Item 2', currency: 'USD', suggested_price: 22, item_page: 'url3', market_page: 'url4', min_price: 20, max_price: 25, mean_price: 22, median_price: 21, quantity: 3, created_at: 1620000000, updated_at: 1620000000 },
        ];

        const nonTradableItems: MarketSkinportItem[] = [
            { market_hash_name: 'Item 1', currency: 'USD', suggested_price: 7, item_page: 'url1', market_page: 'url2', min_price: 5, max_price: 10, mean_price: 7, median_price: 6, quantity: 2, created_at: 1620000000, updated_at: 1620000000 },
            { market_hash_name: 'Item 3', currency: 'USD', suggested_price: 17, item_page: 'url5', market_page: 'url6', min_price: 15, max_price: 20, mean_price: 17, median_price: 16, quantity: 4, created_at: 1620000000, updated_at: 1620000000 },
        ];

        jest.spyOn(Promise, 'all').mockImplementation((promises) => {
            return Promise.resolve([
                tradableItems,
                nonTradableItems
            ]);
        });

        const expectedResponse: MarketResponseItem[] = [
            { marketHashName: 'Item 1', currency: 'USD', itemPage: 'url1', marketPage: 'url2', minTradable: 10, minNonTradable: 5 },
            { marketHashName: 'Item 2', currency: 'USD', itemPage: 'url3', marketPage: 'url4', minTradable: 20, minNonTradable: null },
            { marketHashName: 'Item 3', currency: 'USD', itemPage: 'url5', marketPage: 'url6', minTradable: null, minNonTradable: 15 },
        ];

        const items = await marketService.getItems();

        expect(items).toEqual(expectedResponse);
    });

});