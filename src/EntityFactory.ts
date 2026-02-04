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

export class EntityFactory {
    private readonly itemBlueprints = new Map<string, ItemBlueprint>();
    private readonly creatureBlueprints = new Map<string, CreatureBlueprint>();
    private readonly partialCreatureBlueprints = new Map<string, PartialCreatureBlueprint>();

    defineBlueprint<T extends ItemBlueprint | CreatureBlueprint | PartialCreatureBlueprint>(
        oEntityDef: T,
        ref: string
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

    inflateCreatureBlueprint<T extends PartialCreatureBlueprint | CreatureBlueprint>(
        ref: string,
        baseBlueprint: T
    ): T {
        // iterate through extends
        for (const x of baseBlueprint.extends ?? []) {
            const extendedBlueprint = this.inflateCreatureBlueprint(x, baseBlueprint);
            // concat properties, feats, actions
            const xProps = extendedBlueprint.properties ?? [];
            const xFeats = extendedBlueprint.feats ?? [];
            const xActions = extendedBlueprint.actions ?? [];
            const xProficiencies = extendedBlueprint.proficiencies ?? [];
            if (xProps.length > 0) {
                baseBlueprint.properties = baseBlueprint.properties
                    ? baseBlueprint.properties.concat(xProps)
                    : xProps;
            }
            if (xFeats.length > 0) {
                baseBlueprint.feats = baseBlueprint.feats
                    ? baseBlueprint.feats.concat(xFeats)
                    : xFeats;
            }
            if (xActions.length > 0) {
                baseBlueprint.actions = baseBlueprint.actions
                    ? baseBlueprint.actions.concat(xActions)
                    : xActions;
            }
            if (xProficiencies.length > 0) {
                baseBlueprint.proficiencies = baseBlueprint.proficiencies
                    ? baseBlueprint.proficiencies.concat(xProficiencies)
                    : xProficiencies;
            }
        }
        return baseBlueprint;
    }

    createItem(ref: string, id: string = ''): Item {
        const bp = this.itemBlueprints.get(ref);
        if (!bp) {
            throw new Error(`Item blueprint ${ref} not found`);
        }
        return { ...deepClone(bp), ref, id: id.length > 0 ? id : crypto.randomUUID() };
    }

    createCreature(ref: string, id: string = ''): Creature {
        const bpCreature = this.creatureBlueprints.get(ref);
        if (bpCreature) {
            this.inflateCreatureBlueprint(ref);
            for (const x of bpCreature.extends ?? []) {
                const xp = this.inflateCreatureBlueprint(x);
            }
            if (bpCreature.extends && bpCreature.extends.length > 0) {
                const extendedBlueprint = this.inflateCreatureBlueprint();
            }
            return new Creature();
        }
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
