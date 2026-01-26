import { Item, ItemSchema } from './schemas/item';
import Consts from './consts';

export class ItemRepository {
    private blueprints = new Map<string, Item>();
    constructor() {}

    defineBlueprint(id: string, oItemDef: Item) {
        const item = ItemSchema.parse(oItemDef);
        this.blueprints.set(id, item);
        return item;
    }

    getItem(id: string);
}
