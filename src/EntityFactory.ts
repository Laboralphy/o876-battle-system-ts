import { Item, ItemBlueprint, ItemBlueprintSchema } from './schemas/Item';
import { deepClone } from './libs/deep-clone';
import crypto from 'node:crypto';
import { Creature } from './Creature';
import { CreatureBlueprint, CreatureBlueprintSchema } from './schemas/CreatureBlueprint';
import { ExtendableEntity, ExtendResolver } from './ExtendResolver';
import { CONSTS } from './consts';
import { EntityType } from './schemas/enums/EntityType';

import MODULE_CLASSIC from './modules/classic';

export class EntityFactory {
    private readonly itemBlueprints = new Map<string, ItemBlueprint>();
    private readonly creatureBlueprints = new Map<string, CreatureBlueprint>();
    private readonly extendResolver = new ExtendResolver();

    loadModules() {
        for (const [key, blueprint] of Object.entries(MODULE_CLASSIC.blueprints)) {
            this.declareBlueprint(key, blueprint);
        }
    }

    get refs(): string[] {
        return this.extendResolver.keys;
    }

    /**
     * Register a blueprint. The blueprint is allowed to be a partial one.
     * Partial blueprints are resolved when item/creature are created.
     * @param ref
     * @param blueprint
     */
    declareBlueprint(ref: string, blueprint: ExtendableEntity): void {
        this.extendResolver.declareEntity(ref, blueprint);
    }

    getAssetEntityType(ref: string): EntityType {
        return this.extendResolver.getEntityType(ref);
    }

    /**
     * Create an item from a blueprint.
     * If id is not provided, a random id will be generated.
     */
    createItem(refOrBlueprint: string | ItemBlueprint, id: string = ''): Item {
        if (typeof refOrBlueprint === 'string' && this.itemBlueprints.has(refOrBlueprint)) {
            // there is an ItemBlueprint registrered with this ref
            return {
                ...deepClone(this.itemBlueprints.get(refOrBlueprint)!),
                ref: refOrBlueprint,
                id: id === '' ? crypto.randomUUID() : id,
            };
        }
        if (typeof refOrBlueprint === 'string') {
            // no item blueprint registered with this ref
            // create the blueprint with extendResolver
            const oProto = this.extendResolver.resolveEntity(refOrBlueprint);
            const oItemBlueprint = ItemBlueprintSchema.parse(oProto);
            this.itemBlueprints.set(refOrBlueprint, oItemBlueprint);
            return this.createItem(refOrBlueprint, id);
        }
        // refOrBlueprint should be an ItemBlueprint
        // we should register it
        const ref = crypto.createHash('md5').update(JSON.stringify(refOrBlueprint)).digest('hex');
        this.itemBlueprints.set(ref, ItemBlueprintSchema.parse(refOrBlueprint));
        return this.createItem(ref, id);
    }

    createCreature(ref: string, id: string = ''): Creature {
        let bpCreature = this.creatureBlueprints.get(ref);
        if (!bpCreature) {
            // Creature has not been created yet
            bpCreature = CreatureBlueprintSchema.parse(this.extendResolver.resolveEntity(ref));
            this.creatureBlueprints.set(ref, bpCreature);
        }
        const creature = new Creature(id);
        const cs = creature.state;
        // specie and race
        cs.specie = bpCreature.specie;
        cs.race = bpCreature.race ?? '';
        // abilities
        cs.abilities.strength = bpCreature.abilities.strength;
        cs.abilities.dexterity = bpCreature.abilities.dexterity;
        cs.abilities.constitution = bpCreature.abilities.constitution;
        cs.abilities.intelligence = bpCreature.abilities.intelligence;
        cs.abilities.wisdom = bpCreature.abilities.wisdom;
        cs.abilities.charisma = bpCreature.abilities.charisma;

        cs.level = bpCreature.level;
        cs.hitDie = bpCreature.hitDie;
        cs.armorClass = bpCreature.armorClass;
        cs.speed = bpCreature.speed;
        cs.hitPoints = 1;

        // Innate Properties
        bpCreature.properties.forEach((property) => creature.addInnateProperty(property));
        cs.proficiencies.push(...bpCreature.proficiencies);

        bpCreature.equipment.forEach((eq: ItemBlueprint | string) => {
            const item: Item = this.createItem(eq, '');
            creature.equipItem(item);
        });

        cs.selectedOffensiveSlot = CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1;
        // no effect at start

        return creature;
    }

    createEntity(ref: string, id: string = '') {
        const entityType = this.extendResolver.getEntityType(ref);
        switch (entityType) {
            case CONSTS.ENTITY_TYPE_CREATURE: {
                return this.createCreature(ref, id);
            }
            case CONSTS.ENTITY_TYPE_ITEM: {
                return this.createItem(ref, id);
            }
            default: {
                throw new Error(`Entity type ${entityType} not supported`);
            }
        }
    }
}
