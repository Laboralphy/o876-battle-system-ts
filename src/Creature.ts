import { ReactiveStore } from '@laboralphy/reactor';
import { State } from './store/state';
import { buildStore } from './store';
import { Property, PropertySchema } from './properties';
import { PropertyType } from './schemas/enums/PropertyType';
import { aggregateProperties, AggregatorFunc, AggregatorOptions } from './libs/aggregator';
import { Item } from './schemas/Item';
import { EquipItemOutcome } from './schemas/enums/EquipItemOutcome';
import { CONSTS } from './consts';
import { EquipmentSlot } from './schemas/enums/EquipmentSlot';
import { Effect, EffectDefinition, EffectSchema } from './effects';
import { EffectSubtype } from './schemas/enums/EffectSubtype';
import { randomUUID } from 'node:crypto';
import Events from 'node:events';
import { GetterReturnType } from './store/define-getters';

export class Creature {
    private readonly _store: ReactiveStore<State>;
    public readonly events = new Events();

    constructor(private readonly _id: string = '') {
        this._store = buildStore();
    }

    get id(): string {
        return this._id;
    }

    get getters(): GetterReturnType {
        return this._store.getters as GetterReturnType;
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
        return aggregateProperties(aPropertyTypes, this.getters, oFunctions, options);
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
        const availableSlot: EquipmentSlot | undefined = slots.find(
            (slot) => !this._store.state.equipment[slot]
        );
        if (availableSlot) {
            const unequippedItem = this._store.state.equipment[availableSlot];
            this._store.state.equipment[availableSlot] = item;
            return {
                unequippedItem,
                outcome: CONSTS.EQUIP_ITEM_SUCCESS,
            };
        } else {
            // No available slot: must remove item prior to equip the new one
            let lastOutcome = '';
            for (const slot of slots) {
                const eqo = this.unequipSlot(slot);
                if (eqo.outcome === CONSTS.EQUIP_ITEM_SUCCESS) {
                    // an item of one of the suitable slots has been unequipped
                    // use this very slot to equip the new item
                    // ann exit with success
                    const unequippedItem = this._store.state.equipment[slot];
                    this._store.state.equipment[slot] = item;
                    return {
                        unequippedItem,
                        outcome: CONSTS.EQUIP_ITEM_SUCCESS,
                    };
                }
                lastOutcome = eqo.outcome;
            }
            // Could not find an available slot, even after attempting to unequip items
            // Exit
            return {
                outcome: lastOutcome,
                unequippedItem: null,
            };
        }
    }

    applyEffect(
        effectDefinition: EffectDefinition,
        source: string,
        duration: number,
        subtype: EffectSubtype = CONSTS.EFFECT_SUBTYPE_MAGICAL,
        tag: string = ''
    ): Effect {
        const effect: Effect = EffectSchema.parse({
            ...effectDefinition,
            id: randomUUID(),
            source,
            target: this.id,
            duration,
            subtype,
            tag,
            siblings: [],
        });
        let immune: boolean = false;
        this.events.emit(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_APPLIED, {
            creature: this,
            effect,
            immune: () => {
                immune = true;
            },
        });
        if (!immune) {
            this.state.effects.push(effect);
            this.events.emit(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_APPLIED, {
                creature: this,
                effect,
            });
        }
        return effect;
    }

    removeEffect(effect: Effect) {
        const effIndex = this.state.effects.findIndex((eff: Effect) => eff.id === effect.id);
        if (effIndex >= 0) {
            const effect = this.state.effects[effIndex];
            this.events.emit(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_DISPOSED, {
                creature: this,
                effect,
            });
            this.state.effects.splice(effIndex, 1);
        }
    }

    setEffectDuration(effect: Effect, duration: number) {
        const effIndex = this.state.effects.findIndex((eff: Effect) => eff.id === effect.id);
        if (effIndex >= 0) {
            this.state.effects[effIndex].duration = duration;
        }
    }

    depleteEffects() {
        // for (const effect of this.state.effects) {
        for (const effect of this.state.effects) {
            --effect.duration;
        }
        this.removeDeadEffects();
    }

    dispelEffect(effect: Effect) {
        this.setEffectDuration(effect, 0);
    }

    removeDeadEffects() {
        let i = this.state.effects.length - 1;
        while (i >= 0) {
            if (this.state.effects[i].duration <= 0) {
                this.state.effects.splice(i, 1);
            }
            --i;
        }
    }

    // ▗▖   ▗▖   ▄▖                     ▄▖
    // ▐▌   ▄▖  ▟▙▖▗▛▜▖    ▗▛▀ ▐▌▐▌▗▛▀  ▐▌ ▗▛▜▖
    // ▐▌   ▐▌  ▐▌ ▐▛▀▘    ▐▌  ▝▙▟▌▐▌   ▐▌ ▐▛▀▘
    // ▝▀▀▘ ▀▀  ▝▘  ▀▀      ▀▀ ▗▄▛  ▀▀  ▀▀  ▀▀
    // Life cycle

    /**
     * This methode is called each round, the creature state is mutated by applied effects and properties
     */
    mutate() {
        // Regeneration
    }
}
