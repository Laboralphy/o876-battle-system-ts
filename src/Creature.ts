import { ReactiveStore } from '@laboralphy/reactor';
import { State } from './store/state';
import { buildStore } from './store';
import { Property } from './properties';
import { aggregate, AggregateOptions } from './libs/aggregator';
import { Item } from './schemas/Item';
import { EquipItemOutcome } from './schemas/enums/EquipItemOutcome';
import { CONSTS } from './consts';
import { EquipmentSlot } from './schemas/enums/EquipmentSlot';
import { Effect, EffectDefinition, EffectSchema } from './effects';
import { EffectSubtype } from './schemas/enums/EffectSubtype';
import { randomUUID } from 'node:crypto';
import Events from 'node:events';
import { GetterReturnType } from './store/define-getters';
import { PropertyBuilder } from './PropertyBuilder';

export class Creature {
    private readonly _store: ReactiveStore<State, GetterReturnType>;
    public readonly events = new Events();

    constructor(private readonly _id: string = '') {
        this._store = buildStore();
    }

    /**
     * The id of the creature.
     * @returns The id of the creature.
     */
    get id(): string {
        return this._id;
    }

    /**
     * The getters of the creature.
     * @returns The getters of the creature.
     */
    get getters(): GetterReturnType {
        return this._store.getters as GetterReturnType;
    }

    /**
     * The state of the creature.
     * @returns The state of the creature.
     */
    get state() {
        return this._store.state;
    }

    // ▗▄▄▖ ▗▖              ▟▜▖                 ▗▖                  ▗▖                                          ▗▖
    //  ▐▌ ▝▜▛▘▗▛▜▖▐▙▟▙     ▟▛     ▗▛▜▖▗▛▜▌▐▌▐▌ ▄▖ ▐▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘    ▐▙▟▙ ▀▜▖▐▛▜▖ ▀▜▖▗▛▜▌▗▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    //  ▐▌  ▐▌ ▐▛▀▘▐▛▛█    ▐▌▜▛    ▐▛▀▘▝▙▟▌▐▌▐▌ ▐▌ ▐▙▟▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌     ▐▛▛█▗▛▜▌▐▌▐▌▗▛▜▌▝▙▟▌▐▛▀▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    // ▝▀▀▘  ▀▘ ▀▀ ▝▘ ▀     ▀▘▀     ▀▀   ▐▌ ▀▀▘ ▀▀ ▐▌  ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘    ▝▘ ▀ ▀▀▘▝▘▝▘ ▀▀▘▗▄▟▘ ▀▀ ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘

    /**
     * Returns the slot where the item is equipped
     * @param item - The item to find the slot of.
     * @returns The slot where the item is equipped, or undefined if the item is not equipped.
     */
    findEquippedItemSlot(item: Item): EquipmentSlot | undefined {
        for (const slot in this._store.state.equipment) {
            if (this._store.state.equipment[slot] === item) {
                return slot;
            }
        }
        return undefined;
    }

    /**
     * Remove the item from the equipment list.
     * If the item is not equipped, exit.
     * @param item - The item to remove from the equipment list.
     * @returns The outcome of the operation. @see constant group EQUI_ITEM_*
     */
    unequipItem(item: Item): EquipItemOutcome {
        const slot = this.findEquippedItemSlot(item);
        // Check if item is really equipped
        if (!slot) {
            // Item not equipped : exit
            return CONSTS.EQUIP_ITEM_FAILURE_REASON_NOT_EQUIPPED;
        }
        // Check if item is cursed
        if (
            this.aggregate({
                properties: {
                    types: [CONSTS.PROPERTY_CURSED],
                    options: { restrictSlots: [slot] },
                },
            }).count > 0
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
     * @param slot - The slot to remove the item from.
     * @returns An object containing the outcome of the operation and the item that has been removed from the slot.
     * The operation may failed if the item in the specified slot is cursed
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

    /**
     * Equip the item in the first available slot.
     * If no slot is available, unequip items in other slots until an available slot is found.
     * @param item - The item to equip.
     * @returns An object containing the outcome of the operation and the item that has been equipped.
     * The operation may fail if the item currently equipped in the slot is cursed
     * and cannot be replaced by the new item.
     */
    equipItem(item: Item): {
        unequippedItem: Item | null;
        outcome: EquipItemOutcome;
        equippedItem: Item | null;
    } {
        const slots = item.equipmentSlots;
        if (slots.length === 0) {
            // Cannot equip this item: fits in no slot
            return {
                outcome: CONSTS.EQUIP_ITEM_FAILURE_REASON_NO_SUITABLE_SLOT,
                unequippedItem: null,
                equippedItem: null,
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
                equippedItem: this._store.state.equipment[availableSlot],
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
                        equippedItem: this._store.state.equipment[slot],
                    };
                }
                lastOutcome = eqo.outcome;
            }
            // Could not find an available slot, even after attempting to unequip items
            // Exit
            return {
                outcome: lastOutcome,
                unequippedItem: null,
                equippedItem: null,
            };
        }
    }

    // ▗▄▄                      ▗▖                                              ▗▖
    // ▐▌▐▌▐▛▜▖▗▛▜▖▐▛▜▖▗▛▜▖▐▛▜▖▝▜▛▘▐▌▐▌    ▐▙▟▙ ▀▜▖▐▛▜▖ ▀▜▖▗▛▜▌▗▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    // ▐▛▀ ▐▌  ▐▌▐▌▐▙▟▘▐▛▀▘▐▌   ▐▌ ▝▙▟▌    ▐▛▛█▗▛▜▌▐▌▐▌▗▛▜▌▝▙▟▌▐▛▀▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    // ▝▘  ▝▘   ▀▀ ▐▌   ▀▀ ▝▘    ▀▘▗▄▛     ▝▘ ▀ ▀▀▘▝▘▝▘ ▀▀▘▗▄▟▘ ▀▀ ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘

    /**
     * Adds a new innate property to the properties list in the state.
     * @param propDef - The property definition to be added to the innate properties list.
     * @returns The newly created property.
     */
    addInnateProperty(propDef: Property): Property {
        const property: Property = PropertyBuilder.buildProperty(propDef);
        const nNewLength = this._store.state.properties.push(property);
        return this._store.state.properties[nNewLength - 1];
    }

    /**
     * Removes a property from the innate properties list.
     * @param property - The property to be removed from the innate properties list.
     */
    removeInnateProperty(property: Property) {
        const index = this._store.state.properties.indexOf(property);
        if (index > -1) {
            this._store.state.properties.splice(index, 1);
        }
    }

    /**
     * Will aggregate properties and return sum, min, max, and count
     * @param options - Options to filter the properties to aggregate.
     * @returns An object containing aggregated values. @see AggregatorResult
     */
    aggregate(options: AggregateOptions) {
        return aggregate(options, this.getters);
    }

    // ▗▄▄▖  ▄▖  ▄▖         ▗▖                                          ▗▖
    // ▐▙▄  ▟▙▖ ▟▙▖▗▛▜▖▗▛▀ ▝▜▛▘    ▐▙▟▙ ▀▜▖▐▛▜▖ ▀▜▖▗▛▜▌▗▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    // ▐▌   ▐▌  ▐▌ ▐▛▀▘▐▌   ▐▌     ▐▛▛█▗▛▜▌▐▌▐▌▗▛▜▌▝▙▟▌▐▛▀▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    // ▝▀▀▘ ▝▘  ▝▘  ▀▀  ▀▀   ▀▘    ▝▘ ▀ ▀▀▘▝▘▝▘ ▀▀▘▗▄▟▘ ▀▀ ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘

    /**
     * Apply an effect to the creature.
     * The effect will be added to the creature's effects list.
     * The effect will be triggered each round.
     * The effect will be removed from the creature's effects list when it expires.
     * @param effectDefinition - The definition of the effect to apply.
     * @param source - The source of the effect.
     * @param duration - The duration of the effect in rounds.
     * @param subtype - The subtype of the effect.
     * @param tag - A tag to identify the effect.
     * @returns The newly created effect.
     * The newly created effect may be modified to adding siblings, setting effect subtype, etc.
     * See EffectSchema for more details.
     */
    applyEffect(
        effectDefinition: EffectDefinition,
        source: Creature,
        duration: number,
        subtype: EffectSubtype = CONSTS.EFFECT_SUBTYPE_MAGICAL,
        tag: string = ''
    ): Effect {
        const effect: Effect = EffectSchema.parse({
            ...effectDefinition,
            id: randomUUID(),
            source: source.id,
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

    /**
     * Remove an effect from the creature's effects list.
     * If the effect is not found in the creature's effects list, exit.
     * @param effect - The effect to remove from the creature's effects list.
     */
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

    /**
     * Set the duration of an effect.
     * If the effect is not found in the creature's effects list, exit.
     * @param effect - The effect to modify.
     * @param duration - The new duration of the effect.
     */
    setEffectDuration(effect: Effect, duration: number) {
        const effIndex = this.state.effects.findIndex((eff: Effect) => eff.id === effect.id);
        if (effIndex >= 0) {
            this.state.effects[effIndex].duration = duration;
        }
    }

    /**
     * Decrease each effect duration by 1.
     * Effects that expire will be removed from the creature's effects list.
     * This method should be called each round.
     */
    depleteEffects() {
        for (const effect of this.state.effects) {
            --effect.duration;
        }
        this.removeDeadEffects();
    }

    /**
     * Dispel an effect. Actually set the duration of the effect to 0.
     * The effect will be removed from the creature's effects list.'
     * @param effect - effect to be dispelled
     */
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
    triggerMutate() {
        // Regeneration
    }

    /**
     * Method called each time the creature is attacking
     */
    triggerAttack() {
        // Ailment
    }

    /**
     * Triggered each time the creature is physically attacked
     */
    triggerAttacked() {
        //
    }

    /**
     * Triggered each time the creature is inflicting damage to another target
     */
    triggerDamageInflicted() {
        //
    }

    /**
     * Triggered each time the creature is damaged by another target
     */
    triggerDamageReceived() {
        //
    }
}
