import { Item, ItemBlueprint, ItemBlueprintSchema } from './schemas/Item';
import { deepClone } from './libs/deep-clone';
import crypto from 'node:crypto';
import { Creature } from './Creature';
import { CreatureBlueprint, CreatureBlueprintSchema } from './schemas/CreatureBlueprint';
import { ExtendableEntity, ExtendResolver } from './ExtendResolver';
import { CONSTS } from './consts';
import { EntityType } from './schemas/enums/EntityType';
import MODULE_CLASSIC from './modules/classic';
import MODULE_BASE from './modules/base';
import { Property, PropertyDefinition } from './properties';
import { PropertyBuilder } from './PropertyBuilder';

export class EntityFactory {
    private readonly itemBlueprints = new Map<string, ItemBlueprint>();
    private readonly creatureBlueprints = new Map<string, CreatureBlueprint>();
    public readonly extendResolver = new ExtendResolver();

    constructor() {
        this.loadModules();
    }

    loadModules() {
        for (const m of [MODULE_BASE, MODULE_CLASSIC]) {
            for (const [key, blueprint] of Object.entries(m.blueprints)) {
                this.declareBlueprint(key, blueprint);
            }
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
     * Build an item from a blueprint.
     * If id is not provided, a random id will be generated.
     * @param blueprint blueprint
     * @param id identifier. If not provided, a random id will be generated.
     */
    static buildItemFromBlueprint(blueprint: ItemBlueprint, id: string = ''): Item {
        return {
            ...deepClone(blueprint),
            id: id === '' ? crypto.randomUUID() : id,
        };
    }

    /**
     * Create an item from a blueprint.
     * If id is not provided, a random id will be generated.
     */
    createItem(refOrBlueprint: string | ItemBlueprint, id: string = ''): Item {
        if (typeof refOrBlueprint === 'string' && this.itemBlueprints.has(refOrBlueprint)) {
            // there is an ItemBlueprint registrered with this ref
            return EntityFactory.buildItemFromBlueprint(
                this.itemBlueprints.get(refOrBlueprint)!,
                id
            );
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
        bpCreature.properties.forEach((property: PropertyDefinition) =>
            creature.addInnateProperty(property)
        );
        cs.proficiencies.push(...bpCreature.proficiencies);

        bpCreature.equipment.forEach((eq: ItemBlueprint | string) => {
            const item: Item = this.createItem(eq, '');
            creature.equipItem(item);
        });

        cs.selectedOffensiveSlot = CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1;
        // no effect at start

        return creature;
    }

    isCreatureRef(entity: object): entity is Creature {
        return 'entityType' in entity && entity.entityType === CONSTS.ENTITY_TYPE_CREATURE;
    }

    isItemRef(entity: object): entity is Item {
        return 'entityType' in entity && entity.entityType === CONSTS.ENTITY_TYPE_ITEM;
    }

    createEntity<T extends Creature | Item>(ref: string, id?: string): T;

    // Implémentation
    createEntity(ref: string, id: string = ''): Creature | Item {
        const entity = this.extendResolver.resolveEntity(ref);
        if (this.isCreatureRef(entity)) {
            return this.createCreature(ref, id);
        } else if (this.isItemRef(entity)) {
            return this.createItem(ref, id);
        } else {
            throw new Error(`Entity type ${entity.entityType} not supported`);
        }
    }

    addItemProperty(item: Item, propDef: PropertyDefinition): Property {
        const property = PropertyBuilder.buildProperty(propDef);
        const nNewLength = item.properties.push(property);
        return item.properties[nNewLength - 1];
    }

    removeItemProperty(item: Item, property: Property) {
        const nIndex = item.properties.indexOf(property);
        if (nIndex !== -1) {
            item.properties.splice(nIndex, 1);
        }
    }
}
