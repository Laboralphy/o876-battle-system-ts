import { Item, ItemSchema } from './schemas/item';

export class ItemRepository {
    private blueprints = new Map<string, Item>();
    constructor() {}

    defineBlueprint(id: string, oItemDef: Item) {
        const item = ItemSchema.parse(oItemDef);
        this.blueprints.set(id, item);
        return item;
    }
}
