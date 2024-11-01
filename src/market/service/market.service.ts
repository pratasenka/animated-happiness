import { injectable } from 'tsyringe';
import axios from 'axios';

import { MarketServiceInterface } from './market.service.interface';
import { MarketResponseItem } from '../dtos/response-item.type';
import { MarketSkinportItem } from '../dtos/skinport-item.type';

@injectable()
export class MarketService implements MarketServiceInterface {

    constructor() { }

    public async getItems(): Promise<MarketResponseItem[]> {
        const [tradableSkinportItems, nonTradableSkinportItems]:
            [MarketSkinportItem[], MarketSkinportItem[]] = await Promise.all([
                this.getSkinportItems(true),
                this.getSkinportItems(false)
            ]);

        const itemsMapping: Map<string, MarketResponseItem> = new Map();

        tradableSkinportItems.forEach((item: MarketSkinportItem) => {
            itemsMapping.set(item.market_hash_name, this.convertSkinportToResponseItem(item, true))
        });

        nonTradableSkinportItems.forEach((item: MarketSkinportItem) => {
            const itemForUpdate: MarketResponseItem | undefined = itemsMapping.get(item.market_hash_name);

            if (itemForUpdate) itemForUpdate.minNonTradable = item.min_price;
            else itemsMapping.set(item.market_hash_name, this.convertSkinportToResponseItem(item, false))
        });

        return Array.from(itemsMapping.values());
    }

    private convertSkinportToResponseItem(item: MarketSkinportItem, tradable: boolean): MarketResponseItem {
        return {
            marketHashName: item.market_hash_name,
            currency: item.currency,
            itemPage: item.item_page,
            marketPage: item.market_page,
            minTradable: !tradable ? null : item.min_price ?? null,
            minNonTradable: tradable ? null : item.min_price ?? null,
        }
    }

    private async getSkinportItems(onlyTreadable: boolean): Promise<MarketSkinportItem[]> {
        const response = await axios.get<MarketSkinportItem[]>('https://api.skinport.com/v1/items', {
            params: { tradable: onlyTreadable ? 1 : 0 }
        })

        return response.data;
    }
}