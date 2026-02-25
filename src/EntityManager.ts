import { Item, ItemBlueprint, ItemBlueprintSchema } from './schemas/Item';
import { deepClone } from './libs/deep-clone';
import crypto, { randomUUID } from 'node:crypto';
import { Creature } from './Creature';
import { CreatureBlueprint, CreatureBlueprintSchema } from './schemas/CreatureBlueprint';
import { ExtendableEntity, ExtendResolver } from './ExtendResolver';
import { CONSTS } from './consts';
import { EntityType } from './schemas/enums/EntityType';
import MODULE_CLASSIC from './modules/classic';
import MODULE_BASE from './modules/base';
import { Property } from './properties';
import { PropertyBuilder } from './PropertyBuilder';
import { TemporaryProperty } from './schemas/TemporaryProperty';

export class EntityManager {
    private readonly itemBlueprints = new Map<string, ItemBlueprint>();
    private readonly creatureBlueprints = new Map<string, CreatureBlueprint>();
    public readonly extendResolver = new ExtendResolver();
    private readonly temporaryProperties = new Map<
        string,
        { item: Item; temporaryProperty: TemporaryProperty }
    >();
    private readonly itemRegistry = new Map<string, Item>();
    private readonly itemOwnerRegistry = new Map<string, Creature>();
    private readonly creatureRegistry = new Map<string, Creature>();

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
            temporaryProperties: [],
        };
    }

    /**
     * Register an item blueprint.
     * All parameters are mandatory. Registering an item twice with the same blueprint reference will throw an error.
     * @param sRef blueprint reference
     * @param bp blueprint
     * @param sId item identifier. If not provided, a random id will be generated.
     * @return An item instance
     */
    private registerItem(sRef: string, bp: object, sId: string): Item {
        if (this.itemRegistry.has(sId)) {
            throw new Error(`Item with the same ID ${sId} already exists`);
        }
        const oItemBlueprint: ItemBlueprint = ItemBlueprintSchema.parse(bp);
        // We are pretty sure this blueprint does not already exist
        this.itemBlueprints.set(sRef, oItemBlueprint);
        const oItem = this.createItem(sRef, sId);
        this.itemRegistry.set(oItem.id, oItem);
        return oItem;
    }

    /**
     * Create an item from a blueprint.
     * If id is not provided, a random id will be generated.
     */
    createItem(refOrBlueprint: string | ItemBlueprint, id: string = ''): Item {
        if (typeof refOrBlueprint === 'string' && this.itemBlueprints.has(refOrBlueprint)) {
            // there is an ItemBlueprint registrered with this ref
            return EntityManager.buildItemFromBlueprint(
                this.itemBlueprints.get(refOrBlueprint)!,
                id
            );
        }
        if (typeof refOrBlueprint === 'string') {
            // no item blueprint registered with this ref
            // create the blueprint with extendResolver
            return this.registerItem(
                refOrBlueprint,
                this.extendResolver.resolveEntity(refOrBlueprint),
                id
            );
        } else if (typeof refOrBlueprint === 'object' && !!refOrBlueprint) {
            // refOrBlueprint should be an ItemBlueprint
            // we should register it
            const ref = crypto
                .createHash('md5')
                .update(JSON.stringify(refOrBlueprint))
                .digest('hex');
            return this.registerItem(ref, refOrBlueprint, id);
        } else {
            throw new Error(`Invalid item blueprint ${refOrBlueprint}`);
        }
    }

    createCreature(ref: string, id: string = ''): Creature {
        let bpCreature = this.creatureBlueprints.get(ref);
        if (!bpCreature) {
            // Creature has not been created yet
            bpCreature = CreatureBlueprintSchema.parse(this.extendResolver.resolveEntity(ref));
            this.creatureBlueprints.set(ref, bpCreature);
        }
        const creature = new Creature(id === '' ? randomUUID() : id);
        if (this.creatureRegistry.has(creature.id)) {
            throw new Error(`Creature with the same ID ${creature.id} already exists`);
        }
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

        bpCreature.actions.forEach((action) => {
            cs.actions.push({
                blueprint: action,
                cooldownTimer: [],
                delayTimer: 0,
            });
        });

        // Innate Properties
        bpCreature.properties.forEach((property: Property) => creature.addInnateProperty(property));
        cs.proficiencies.push(...bpCreature.proficiencies);

        bpCreature.equipment.forEach((eq: ItemBlueprint | string) => {
            const item: Item = this.createItem(eq, '');
            creature.equipItem(item);
        });

        cs.selectedOffensiveSlot = CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1;
        // no effect at start

        this.creatureRegistry.set(creature.id, creature);
        return creature;
    }

    isCreatureRef(entity: object): entity is Creature {
        return 'entityType' in entity && entity.entityType === CONSTS.ENTITY_TYPE_CREATURE;
    }

    isItemRef(entity: object): entity is Item {
        return 'entityType' in entity && entity.entityType === CONSTS.ENTITY_TYPE_ITEM;
    }

    createEntity<T extends Creature | Item>(ref: string, id?: string): T;
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

    destroyItem(item: Item): void {
        // destroy item and all temporary properties assigned to this item
        // 1. get all temporary item properties
        item.temporaryProperties
            .slice(0) // working on a copy of the array to avoid mutation while iterating
            .forEach((tp) => this.removeItemTemporaryProperty(item, tp));
        // Get item owner and unequip item even if item is cursed
    }

    /**
     * Add a property to an item.
     * The property is cloned before being added to the item.
     * The property is added at the end of the item.properties array.
     * @param item Item to add the property to.
     * @param propDef Property definition.
     * @returns The added property. This is a reactive version of the newly created property.
     */
    addItemProperty(item: Item, propDef: Property): Property {
        const property: Property = PropertyBuilder.buildProperty(propDef);
        const nNewLength = item.properties.push(property);
        return item.properties[nNewLength - 1];
    }

    /**
     * Same as addItemProperty but the property is added to the item temporaryProperties array.
     * The property is cloned before being added to the item temporaryProperties array.
     * The property is added at the end of the item temporaryProperties array.
     * This property is a temporary property that will be removed after a certain duration.
     * This is used when a specific enhancement is cast on the item, that "bless" or "imbue" the item with a specific property.
     * @param item Item to add the property to.
     * @param propDef Property definition.
     * @param duration Duration of the temporary property.
     * @param tag Tag of the property. This is used to manage stackable temporary properties.
     * @returns The added property. This is a reactive version of the newly created property.
     */
    addItemTemporaryProperty(
        item: Item,
        propDef: Property,
        duration: number,
        tag: string = ''
    ): TemporaryProperty {
        const tp: TemporaryProperty = PropertyBuilder.buildTemporaryProperty(
            propDef,
            duration,
            tag
        );
        const nNewLength = item.temporaryProperties.push(tp);
        // keep tract of this property for duration depletion
        const newTmpProp = item.temporaryProperties[nNewLength - 1];
        this.temporaryProperties.set(newTmpProp.id, { item, temporaryProperty: newTmpProp });
        return newTmpProp;
    }

    /**
     * Remove a property from an item.
     * The property is removed from the item.properties array.
     * If the property is not found, nothing happens.
     * @param item Item to remove the property from.
     * @param property Property to remove.
     */
    removeItemProperty(item: Item, property: Property) {
        const nIndex = item.properties.indexOf(property);
        if (nIndex !== -1) {
            item.properties.splice(nIndex, 1);
        }
    }

    removeItemTemporaryProperty(item: Item, temporaryProperty: TemporaryProperty) {
        const nIndex = item.temporaryProperties.indexOf(temporaryProperty);
        if (nIndex !== -1) {
            item.temporaryProperties.splice(nIndex, 1);
        }
        this.temporaryProperties.delete(temporaryProperty.id);
    }

    /**
     * Decrease all temporary properties duration
     * temporary properties whose duration reach 0 are removed from item
     */
    depleteItemTemporaryProperties() {
        this.temporaryProperties.values().forEach(({ item, temporaryProperty: tp }) => {
            if (--tp.duration <= 0) {
                this.removeItemTemporaryProperty(item, tp);
                this.temporaryProperties.delete(tp.id);
            }
        });
    }
}
