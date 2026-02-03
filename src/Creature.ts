import { ReactiveStore } from '@laboralphy/reactor';
import { State } from './store/state';
import { buildStore } from './store';
import { Property, PropertySchema } from './properties';
import { PropertyType } from './schemas/enums/PropertyType';
import { aggregateProperties, AggregatorFunc, AggregatorOptions } from './libs/aggregator';
import { CreatureBlueprint } from './schemas/CreatureBlueprint';
import { Item, ItemBlueprintSchema } from './schemas/Item';
import { EquipItemOutcome } from './schemas/enums/EquipItemOutcome';
import { CONSTS } from './consts';
import { EquipmentSlot } from './schemas/enums/EquipmentSlot';

export class Creature {
    private readonly _store: ReactiveStore<State>;

    constructor() {
        this._store = buildStore();
    }

    static create(blueprint: CreatureBlueprint): Creature {
        const creature = new Creature();
        // specie and race
        creature.state.specie = blueprint.specie;
        creature.state.race = blueprint.race;
        // abilities
        creature.state.abilities.strength = blueprint.abilities.strength;
        creature.state.abilities.dexterity = blueprint.abilities.dexterity;
        creature.state.abilities.constitution = blueprint.abilities.constitution;
        creature.state.abilities.intelligence = blueprint.abilities.intelligence;
        creature.state.abilities.wisdom = blueprint.abilities.wisdom;
        creature.state.abilities.charisma = blueprint.abilities.charisma;

        creature.state.level = blueprint.level;
        creature.state.hitDie = blueprint.hitDie;
        creature.state.naturalArmorClass = blueprint.ac;
        creature.state.speed = blueprint.speed;
        creature.state.hitPoints = 1;

        // Innate Properties
        blueprint.properties.forEach((property) => creature.addInnateProperty(property));
        creature.state.proficiencies.push(...blueprint.proficiencies);
        blueprint.equipment.forEach((equipementItem) => {
            if (typeof equipementItem === 'string') {
            } else if (typeof equipementItem === 'object') {
                // check if its a real item
                const oItem: Item = ItemBlueprintSchema.parse(equipementItem);
                // see ? oItem is a real item
            }
        });

        return creature;
    }

    get getters() {
        return this._store.getters;
    }

    get state() {
        return this._store.state;
    }

    /**
     * Adds a new innate property to the properties list in the state.
     *
     * @param {Property} property - The property to be added to the innate properties list.
     * @return {Property} The property that was added to the list.
     */
    addInnateProperty(property: Property) {
        const nNewLength = this._store.state.properties.push(PropertySchema.parse(property));
        return this._store.state.properties[nNewLength - 1];
    }

    /**
     * Removes a property from the innate properties list.
     * @param {Property} property - The property to be removed from the innate properties list.
     */
    removeInnateProperty(property: Property) {
        const index = this._store.state.properties.indexOf(property);
        if (index > -1) {
            this._store.state.properties.splice(index, 1);
        }
    }

    /**
     * Will aggregate properties and return sum, min, max, and count
     * @param aPropertyTypes
     * @param oFunctions
     * @param options
     * @return {AggregatorAccumulator & { discriminator: Record<string, AggregatorAccumulator> }}
     */
    aggregateProperties(
        aPropertyTypes: PropertyType[],
        oFunctions: AggregatorFunc<Property> = {},
        options: AggregatorOptions = {}
    ) {
        return aggregateProperties(aPropertyTypes, this, oFunctions, options);
    }

    /**
     * Returns the slot where the item is equipped
     * @param item
     */
    findEquippedItemSlot(item: Item): EquipmentSlot | undefined {
        for (const slot in this._store.state.equipment) {
            if (this._store.state.equipment[slot] === item) {
                return slot;
            }
        }
        return undefined;
    }

    unequipItem(item: Item): EquipItemOutcome {
        const slot = this.findEquippedItemSlot(item);
        // Check if item is really equipped
        if (!slot) {
            // Item not equipped : exit
            return CONSTS.EQUIP_ITEM_FAILURE_REASON_NOT_EQUIPPED;
        }
        // Check if item is cursed
        if (
            this.aggregateProperties([CONSTS.PROPERTY_CURSED], {}, { restrictSlots: [slot] })
                .count > 0
        ) {
            // Item is cursed and cannot be removed
            return CONSTS.EQUIP_ITEM_FAILURE_REASON_CURSED_SLOT;
        }
        // Item is equipped and not cursed: it can be safely removed
        this._store.state.equipment[slot] = null;
        return CONSTS.EQUIP_ITEM_SUCCESS;
    }

    /**
     * Remove item currently equipped in the given slot. If no item is equipped in this slot, exit.
     * @param slot
     */
    unequipSlot(slot: EquipmentSlot): {
        unequippedItem: Item | null;
        outcome: EquipItemOutcome;
    } {
        const item = this._store.state.equipment[slot];
        if (!item) {
            // No item equipped in this slot
            return {
                unequippedItem: null,
                outcome: CONSTS.EQUIP_ITEM_FAILURE_REASON_NOT_EQUIPPED,
            };
        }
        const outcome = this.unequipItem(item);
        return {
            unequippedItem: outcome === CONSTS.EQUIP_ITEM_SUCCESS ? item : null,
            outcome,
        };
    }

    equipItem(item: Item): {
        unequippedItem: Item | null;
        outcome: EquipItemOutcome;
    } {
        const slots = item.equipmentSlots;
        if (slots.length === 0) {
            // Cannot equip this item: fits in no slot
            return {
                outcome: CONSTS.EQUIP_ITEM_FAILURE_REASON_NO_SUITABLE_SLOT,
                unequippedItem: null,
            };
        }
        // get the first slot available
        let availableSlot = slots.find((slot) => !this._store.state.equipment[slot]);
        if (!availableSlot) {
            const bUnequipSuccess = false;
            // No available slot: must remove item prior to equip the new one
            for (const slot of slots) {
                const eqo = this.unequipSlot(slot);
                if (eqo.outcome === CONSTS.EQUIP_ITEM_SUCCESS) {
                    availableSlot = slot;
                    break;
                }
            }
            // Could not find an available slot, even after attempting to unequip items
            // Exit
            return {
                outcome: CONSTS.EQUIP_ITEM_FAILURE_REASON_NO_SUITABLE_SLOT,
                unequippedItem: null,
            };
        }
        this._store.state.equipment[availableSlot] = item;
        return item;
    }
}
