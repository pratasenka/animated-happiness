export interface ItemServiceInterface {
    buyItem(itemId: string, userId: string): Promise<number>;
}