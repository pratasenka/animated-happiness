import "reflect-metadata";
import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { ItemServiceInterface } from '../service/item.service.interface';


@injectable()
export class ItemController {
    constructor(@inject("ItemServiceInterface") private itemService: ItemServiceInterface) { }

    public async buyItem(req: Request, res: Response) {
        try {
            const { itemId }: { itemId: string } = req.body;

            if (req.session.userId) {
                const userId: string = req.session.userId;

                const moneyLeft: number = await this.itemService.buyItem(itemId, userId);
                res.send(moneyLeft);
            } else res.status(401).json({ message: 'Unauthorized' });

        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
