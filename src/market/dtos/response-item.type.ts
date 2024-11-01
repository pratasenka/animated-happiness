export interface MarketResponseItem {
    marketHashName: string;
    currency: string;
    itemPage: string;
    marketPage: string;
    minTradable: number | null;
    minNonTradable: number | null;
}