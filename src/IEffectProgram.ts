import { Effect } from './effects';
import { Creature } from './Creature';

export interface IEffectProgram {
    /**
     * Called when an effect is applied to a creature
     */
    apply?(effect: Effect, target: Creature, source: Creature): void;

    /**
     * Called when it is time to ask all installed effects, if one of them rejects the new effect
     * If an effect returns true, the new effect is discarded
     */
    reject?(effect: Effect, target: Creature, source: Creature): boolean;

    /**
     * Called each turn
     */
    mutate?(effect: Effect, target: Creature, source: Creature): void;

    /**
     * Called when effect is removed from creature
     */
    dispose?(effect: Effect, target: Creature, source: Creature): void;
}
