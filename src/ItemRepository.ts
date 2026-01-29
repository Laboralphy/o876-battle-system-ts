import { Item, ItemSchema } from './schemas/Item';

export class ItemRepository {
    private readonly blueprints = new Map<string, Item>();
    constructor() {}

    defineBlueprint(id: string, oItemDef: Item) {
        const item = ItemSchema.parse(oItemDef);
        this.blueprints.set(id, item);
        return item;
    }
}
