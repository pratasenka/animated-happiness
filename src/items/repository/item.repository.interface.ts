import { Item } from "../item.model";

export interface ItemRepositoryInterface {
    buyItem(itemId: string, userId: string): Promise<number | null>;
}