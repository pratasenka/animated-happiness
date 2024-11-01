import { MarketResponseItem } from "../dtos/response-item.type";

export interface MarketServiceInterface {
    getItems(): Promise<MarketResponseItem[]>;
}