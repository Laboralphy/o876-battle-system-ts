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
import { EventCreatureRemoveItem } from './schemas/events/EventCreatureRemoveItem';
import { EventCreatureRemoveItemFailed } from './schemas/events/EventCreatureRemoveItemFailed';
import { EventEffectProcessorCreatureEffect } from './schemas/events/EventEffectProcessorCreatureEffect';
import { EventEffectProcessorImmunity } from './schemas/events/EventEffectProcessorImmunity';
import { EventCreatureEquipItem } from './schemas/events/EventCreatureEquipItem';
import { EffectType } from './schemas/enums/EffectType';
import { PropertyType } from './schemas/enums/PropertyType';
import { ThreatType } from './schemas/enums/ThreatType';
import { Ability } from './schemas/enums/Ability';
import { CreatureVisibility } from './schemas/enums/CreatureVisibility';
import { SavingThrowOutcome } from './SavingThrowOutcome';
import { Advantage } from './schemas/enums/Advantage';
import { Disadvantage } from './schemas/enums/Disadvantage';
import { EventCreatureEquipItemFailed } from './schemas/events/EventCreatureEquipItemFailed';
import { Attack } from './Attack';
import { propertyHasProgram, propertyRunProgramAttack } from './property-program-runner';

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

    emit<T>(event: string, payload: T): boolean {
        return this.events.emit(event, payload);
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
        const itemId = item.id;
        for (const slot in this._store.state.equipment) {
            const slotItemId = this._store.state.equipment[slot]?.id ?? '';
            if (slotItemId === itemId) {
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
            this.emit<EventCreatureRemoveItemFailed>(CONSTS.EVENT_CREATURE_REMOVE_ITEM_FAILED, {
                creature: this,
                item,
                reason: CONSTS.EQUIP_ITEM_FAILURE_REASON_NOT_EQUIPPED,
            });
            return CONSTS.EQUIP_ITEM_FAILURE_REASON_NOT_EQUIPPED;
        }
        // Check if item is cursed
        if (
            this.aggregate([CONSTS.PROPERTY_CURSED], {
                restrictSlots: [slot],
            }).count > 0
        ) {
            // Item is cursed and cannot be removed
            this.emit<EventCreatureRemoveItemFailed>(CONSTS.EVENT_CREATURE_REMOVE_ITEM_FAILED, {
                creature: this,
                item,
                slot,
                reason: CONSTS.EQUIP_ITEM_FAILURE_REASON_CURSED_SLOT,
            });
            return CONSTS.EQUIP_ITEM_FAILURE_REASON_CURSED_SLOT;
        }
        // Item is equipped and not cursed: it can be safely removed
        this._store.state.equipment[slot] = null;
        this.emit<EventCreatureRemoveItem>(CONSTS.EVENT_CREATURE_REMOVE_ITEM, {
            creature: this,
            item,
            slot,
        });
        return CONSTS.EQUIP_ITEM_SUCCESS;
    }

    /**
     * Remove item currently equipped in the given slot. If no item is equipped in this slot, exit.
     * @param slot - The slot to remove the item from.
     * @returns An object containing the outcome of the operation and the item that has been removed from the slot.
     * The operation may failed if the item in the specified slot is cursed
     */
    private unequipSlot(slot: EquipmentSlot): {
        unequippedItem: Item | null;
        outcome: EquipItemOutcome;
    } {
        const item = this._store.state.equipment[slot];
        if (!item) {
            // No item equipped in this slot
            // Cannot fire Creature Remove Item Failed event because no referenced item (slot is empty)
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
            this.emit<EventCreatureEquipItemFailed>(CONSTS.EVENT_CREATURE_EQUIP_ITEM_FAILED, {
                creature: this,
                item,
                reason: CONSTS.EQUIP_ITEM_FAILURE_REASON_NO_SUITABLE_SLOT,
            });
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
            // Available slot identified ; no previous item to unequip
            this._store.state.equipment[availableSlot] = item;
            this.emit<EventCreatureEquipItem>(CONSTS.EVENT_CREATURE_EQUIP_ITEM, {
                item: this._store.state.equipment[availableSlot],
                creature: this,
                slot: availableSlot,
            });
            return {
                unequippedItem: null,
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
                    this._store.state.equipment[slot] = item;
                    this.emit<EventCreatureEquipItem>(CONSTS.EVENT_CREATURE_EQUIP_ITEM, {
                        item: this._store.state.equipment[slot],
                        creature: this,
                        slot: slot,
                    });
                    return {
                        unequippedItem: eqo.unequippedItem,
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
     * @param types - Types of properties or effects to aggregate.
     * @param options - Options to filter the properties to aggregate.
     * @returns An object containing aggregated values. @see AggregatorResult
     */
    aggregate(types: (EffectType | PropertyType)[], options: AggregateOptions) {
        return aggregate(types, options, this.getters);
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
        this.emit<EventEffectProcessorImmunity>(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_APPLIED, {
            creature: this,
            effect,
            immune: () => {
                immune = true;
            },
        });
        if (!immune) {
            this.state.effects.push(effect);
            this.emit<EventEffectProcessorCreatureEffect>(
                CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_APPLIED,
                {
                    creature: this,
                    effect,
                }
            );
        }
        return effect;
    }

    /**
     * Apply an effect group to the creature.
     * For all effect definition specified, the corresponding effect will be created and added to the creature's effects
     * list unless the creature is immune to the effect.
     *
     * @param effectDefinitions - The definitions of all effects in the groupe.
     * @param source - The source of the effect.
     * @param duration - The duration of the effect in rounds.
     * @param subtype - The subtype of the effect.
     * @param tag - A tag to identify the effect.
     */
    applyEffectGroup(
        effectDefinitions: EffectDefinition[],
        source: Creature,
        duration: number,
        subtype: EffectSubtype = CONSTS.EFFECT_SUBTYPE_MAGICAL,
        tag: string = ''
    ): Effect[] {
        const aEffectIds: string[] = [];
        const aEffects: Effect[] = [];
        for (const effectDefinition of effectDefinitions) {
            const effect: Effect = EffectSchema.parse({
                ...effectDefinition,
                id: randomUUID(),
                source: source.id,
                target: this.id,
                duration,
                subtype,
                tag,
                siblings: aEffectIds,
            });
            let immune: boolean = false;
            this.emit<EventEffectProcessorImmunity>(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_APPLIED, {
                creature: this,
                effect,
                immune: () => {
                    immune = true;
                },
            });
            if (!immune) {
                aEffectIds.push(effect.id);
                aEffects.push(effect);
                this.state.effects.push(effect);
                this.emit<EventEffectProcessorCreatureEffect>(
                    CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_APPLIED,
                    {
                        creature: this,
                        effect,
                    }
                );
            }
        }
        return aEffects;
    }

    /**
     * Remove an effect from the creature's effects list.
     * If the effect is not found in the creature's effects list, exit.
     * @param effect - The effect to remove from the creature's effects list.
     * @param bIgnoreSiblings - If true, the effect will be removed, but its siblings will not be removed.
     * If false (default value), the effect and its siblings will be removed.
     */
    removeEffect(effect: Effect, bIgnoreSiblings: boolean = false) {
        const effIndex = this.state.effects.findIndex((eff: Effect) => eff.id === effect.id);
        if (effIndex >= 0) {
            // effect was found in the effects list
            const effect = this.state.effects[effIndex];
            if (!bIgnoreSiblings) {
                // remove siblings
                effect.siblings.forEach((siblingId: string) => {
                    const sibling = this.findEffectById(siblingId);
                    if (sibling) {
                        // Remove this sibling, but ignore the sibling's siblings
                        this.removeEffect(sibling, true);
                    }
                });
                // all siblings have been removed, remove the effect itself
                this.removeEffect(effect, true);
                return;
            }
            this.emit<EventEffectProcessorCreatureEffect>(
                CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_DISPOSED,
                {
                    creature: this,
                    effect,
                }
            );
            this.state.effects.splice(effIndex, 1);
        }
    }

    /**
     * Get an effect from the creature's effects list.
     * If the effect is not found in the creature's effects list, returns undefined.
     * The effect is the Reactive Version of the effect. That means that modifying effect will trigger reactive systeme
     * Thus this function is private.
     * This function works as a sort of type guard.
     * The "Effect" management function set should not throw error when dealing with incorrect effect,
     * to act like NWN : when trying to dispel an effect that does not exist, nothing happens.
     * @param idEffect {string} - The id of the effect to retrieve.
     * @return The instance of the effect with the specified id, or undefined if not found.
     */
    private findEffectById(idEffect: string): Effect | undefined {
        const effIndex = this.state.effects.findIndex((eff: Effect) => eff.id === idEffect);
        return effIndex >= 0 ? this.state.effects[effIndex] : undefined;
    }

    /**
     * Set the duration of an effect.
     * If the effect is not found in the creature's effects list, exit.
     * @param effect - The effect to modify.
     * @param duration - The new duration of the effect.
     */
    setEffectDuration(effect: Effect, duration: number) {
        const effFound = this.findEffectById(effect.id);
        if (effFound) {
            effFound.duration = duration;
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

    /**
     * Removes all effects with expired duration from the creature's state.
     * Iterates backwards through the effects array to safely remove effects whose duration has reached or fallen below 0.
     */
    removeDeadEffects() {
        let i = this.state.effects.length - 1;
        while (i >= 0) {
            if (this.state.effects[i].duration <= 0) {
                this.state.effects.splice(i, 1);
            }
            --i;
        }
    }

    /**
     * Determines if the creature has any active ongoing processes.
     * Returns true if the creature has any active effects or if any of its actions are recharging.
     * @returns True if the creature has active effects or recharging actions, false otherwise.
     */
    isActive(): boolean {
        if (this.getters.getEffects.length > 0) {
            return true;
        }
        // check if one of its action is cooling down
        // or has charges that are resplenishing
        for (const action of Object.values(this.getters.getActions)) {
            if (action.recharging) {
                return true;
            }
        }
        return false;
    }

    rollSavingThrow(ability: Ability, dc: number, threat: ThreatType): SavingThrowOutcome {
        const stb = this.getters.getSavingThrowBonus;
        const nThreatBonus = stb[threat] ?? 0;
        const bonus = stb[ability] + nThreatBonus;
        const result: SavingThrowOutcome = {
            creature: this,
            roll: 0,
            dc,
            success: false,
            bonus,
            ability,
            threat,
            advantages: new Set<Advantage>(),
            disadvantages: new Set<Disadvantage>(),
        };
        return result;
    }

    /**
     * Returns true if this creature can detect its target
     * @param oTarget {Creature}
     * @return {string} CREATURE_VISIBILITY_*
     */
    getCreatureVisibility(oTarget: Creature): CreatureVisibility {
        if (oTarget === this) {
            return CONSTS.CREATURE_VISIBILITY_VISIBLE;
        }
        const mg = this.getters;
        const tg = oTarget.getters;
        const myConditions = mg.getConditionSet;
        const myEffects = mg.getEffectSet;
        const myProps = mg.getPropertySet;
        const myEnv = mg.getEnvironments;
        const targetEffects = tg.getEffectSet;
        const targetProps = tg.getPropertySet;
        if (myConditions.has(CONSTS.CONDITION_BLINDED) || myEnv.has(CONSTS.ENVIRONMENT_FOG)) {
            // Blinded creatures, or creature in fog cannot see target
            return CONSTS.CREATURE_VISIBILITY_BLINDED;
        }
        if (
            targetEffects.has(CONSTS.EFFECT_INVISIBILITY) &&
            !myEffects.has(CONSTS.EFFECT_SEE_INVISIBILITY)
        ) {
            // Invisibility effect prevents target detection unless creature has see invisibility effect
            return CONSTS.CREATURE_VISIBILITY_INVISIBLE;
        }
        if (targetEffects.has(CONSTS.EFFECT_STEALTH)) {
            // Stealth effect prevents target detection
            return CONSTS.CREATURE_VISIBILITY_HIDDEN;
        }
        const bInDarkness = mg.getEnvironments.has(CONSTS.ENVIRONMENT_DARKNESS);
        if (
            bInDarkness &&
            !myEffects.has(CONSTS.EFFECT_DARKVISION) &&
            !myProps.has(CONSTS.PROPERTY_DARKVISION)
        ) {
            // if environment is dark, the creature cannot detect target
            // unless:
            // one of the two creatures has light source
            // the creature has darkvision effect or property
            return myProps.has(CONSTS.PROPERTY_LIGHT) ||
                targetProps.has(CONSTS.PROPERTY_LIGHT) ||
                myEffects.has(CONSTS.EFFECT_LIGHT) ||
                targetEffects.has(CONSTS.EFFECT_LIGHT)
                ? CONSTS.CREATURE_VISIBILITY_VISIBLE
                : CONSTS.CREATURE_VISIBILITY_DARKNESS;
        }
        return CONSTS.CREATURE_VISIBILITY_VISIBLE;
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
        // For each effect and properties
        // Call
    }

    /**
     * Method called each time the creature is attacking
     */
    triggerAttack(attack: Attack) {
        // for each property and effect
        // try to determine effct or property program
        // call attack method of this program
        // first, determine if there is at least one property with program
        const pr: Map<PropertyType, Property[]> = this.getters.getPropertyRegistry;
        for (const [ptype, properties] of pr.entries()) {
            if (propertyHasProgram(ptype)) {
                // play all properties with this type
                for (const property of properties) {
                    propertyRunProgramAttack(property, attack);
                }
            }
        }
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
