import { Item, ItemBlueprint, ItemBlueprintSchema, ItemSchema } from './schemas/Item';
import { deepClone } from './libs/deep-clone';
import crypto from 'node:crypto';
import { Creature } from './Creature';
import { CreatureBlueprint, CreatureBlueprintSchema } from './schemas/CreatureBlueprint';
import { CONSTS } from './consts';

export class EntityFactory {
    private readonly itemBlueprints = new Map<string, ItemBlueprint>();
    private readonly creatureBlueprints = new Map<string, CreatureBlueprint>();

    defineBlueprint<T extends ItemBlueprint | CreatureBlueprint>(ref: string, oEntityDef: T): void {
        if (oEntityDef.entityType === CONSTS.ENTITY_TYPE_ACTOR) {
            const oNewEntity: CreatureBlueprint = CreatureBlueprintSchema.parse(oEntityDef);
            this.creatureBlueprints.set(ref, oNewEntity);
        } else if (oEntityDef.entityType === CONSTS.ENTITY_TYPE_ITEM) {
            const oNewEntity: ItemBlueprint = ItemBlueprintSchema.parse(oEntityDef);
            this.itemBlueprints.set(ref, oNewEntity);
        }
    }

    createItem(ref: string, id: string = ''): Item {
        const bp = this.itemBlueprints.get(ref);
        if (!bp) {
            throw new Error(`Item blueprint ${ref} not found`);
        }
        return { ...deepClone(bp), ref, id: id.length > 0 ? id : crypto.randomUUID() };
    }

    createEntity(ref: string, id: string = ''): Item | Creature {
        if (this.itemBlueprints.has(ref)) {
            return this.createItem(ref, id);
        }
        const bpCreature = this.creatureBlueprints.get(ref);
        if (bpCreature) {
            return new Creature();
        }
        throw new Error(`Entity blueprint ${ref} not found`);
    }
}
