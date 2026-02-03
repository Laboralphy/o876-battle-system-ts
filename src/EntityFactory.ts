import { Item, ItemBlueprint, ItemBlueprintSchema } from './schemas/Item';
import { deepClone } from './libs/deep-clone';
import crypto from 'node:crypto';
import { Creature } from './Creature';
import { CreatureBlueprint, CreatureBlueprintSchema } from './schemas/CreatureBlueprint';
import { CONSTS } from './consts';
import { ExtendedProperties, ExtendedPropertiesSchema } from './schemas/ExtendedProperties';
import { Property } from './properties';

export class EntityFactory {
    private readonly itemBlueprints = new Map<string, ItemBlueprint>();
    private readonly creatureBlueprints = new Map<string, CreatureBlueprint>();
    private readonly extendedProperties = new Map<string, ExtendedProperties>();

    defineBlueprint<T extends ItemBlueprint | CreatureBlueprint | ExtendedProperties>(
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
            case CONSTS.ENTITY_TYPE_PARTIAL_ITEM:
            case CONSTS.ENTITY_TYPE_PARTIAL_CREATURE: {
                const oNewEntity: ExtendedProperties = ExtendedPropertiesSchema.parse(oEntityDef);
                this.extendedProperties.set(ref, oNewEntity);
                break;
            }
            default: {
                throw new TypeError(`unknown entity type ${oEntityDef.entityType}`);
            }
        }
    }

    inflateExtendedProperties(ref: string): Property[] {
        const xp = this.extendedProperties.get(ref);
        if (xp) {
            const aProps: Property[] = [];
            if (xp.extends) {
                xp.extends.forEach((extend) => {
                    aProps.push(...this.inflateExtendedProperties(extend));
                });
            }
        } else {
            throw new ReferenceError(`unknown extended properties for entity ${ref}`);
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
