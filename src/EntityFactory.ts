import { Item, ItemBlueprint, ItemBlueprintSchema } from './schemas/Item';
import { deepClone } from './libs/deep-clone';
import crypto from 'node:crypto';
import { Creature } from './Creature';
import { CreatureBlueprint, CreatureBlueprintSchema } from './schemas/CreatureBlueprint';
import { CONSTS } from './consts';
import {
    PartialCreatureBlueprint,
    PartialCreatureBlueprintSchema,
} from './schemas/PartialCreatureBlueprint';
import { Property } from './properties';

export class EntityFactory {
    private readonly itemBlueprints = new Map<string, ItemBlueprint>();
    private readonly creatureBlueprints = new Map<string, CreatureBlueprint>();
    private readonly partialCreatureBlueprints = new Map<string, PartialCreatureBlueprint>();

    defineBlueprint<T extends ItemBlueprint | CreatureBlueprint | PartialCreatureBlueprint>(
        ref: string,
        oEntityDef: T
    ): void {
        switch (oEntityDef.entityType) {
            case CONSTS.ENTITY_TYPE_CREATURE: {
                const oNewEntity: CreatureBlueprint = CreatureBlueprintSchema.parse(oEntityDef);
                this.creatureBlueprints.set(ref, oNewEntity);
                break;
            }
            case CONSTS.ENTITY_TYPE_ITEM: {
                const oNewEntity: ItemBlueprint = ItemBlueprintSchema.parse(oEntityDef);
                this.itemBlueprints.set(ref, oNewEntity);
                break;
            }
            case CONSTS.ENTITY_TYPE_PARTIAL_CREATURE: {
                const oNewEntity: PartialCreatureBlueprint =
                    PartialCreatureBlueprintSchema.parse(oEntityDef);
                this.partialCreatureBlueprints.set(ref, oNewEntity);
                break;
            }
            default: {
                throw new TypeError(`unknown entity type ${oEntityDef.entityType}`);
            }
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
