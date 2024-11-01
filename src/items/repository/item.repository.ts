import { injectable } from 'tsyringe';

import pool from '../../utils/db';
import { ItemRepositoryInterface } from './item.repository.interface';

@injectable()
export class ItemRepository implements ItemRepositoryInterface {
    public async buyItem(itemId: string, userId: string): Promise<number | null> {
        const queryResult: any = await pool.query('SELECT purchase_item($1, $2);', [userId, itemId]);
        return queryResult.rows[0]?.purchase_item;
    }
}
