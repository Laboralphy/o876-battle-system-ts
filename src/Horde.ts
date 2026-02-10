import { Creature } from './Creature';

export class Horde {
    private readonly _creatures = new Map<string, Creature>();
    private readonly _activeCreatures = new Set<Creature>();

    /**
     * Add a new creature to the horde. Unless a creature with the same id has already been registered
     */
    linkCreature(creature: Creature): void {
        if (this._creatures.has(creature.id)) {
            throw new Error(`Duplicate creature identifier : ${creature.id}`);
        }
        this._creatures.set(creature.id, creature);
    }

    /**
     * Remove a previously linked creature from creature registry
     */
    unlinkCreature(creature: Creature): void {
        if (this._creatures.has(creature.id)) {
            this._creatures.delete(creature.id);
        } else {
            throw new ReferenceError(`Unknown creature ${creature.id}`);
        }
    }

    /**
     * Return the creature identified by the specifed parameter
     */
    getCreature(id: string): Creature | undefined {
        return this._creatures.get(id);
    }

    /**
     * return true if creature identifier exists in horde
     */
    hasCreature(id: string): boolean {
        return this._creatures.has(id);
    }

    /**
     * return all creatures as an array of creatures
     */
    get creatures(): Creature[] {
        return Array.from(this._creatures.values());
    }

    /**
     * Returns number of defined creature
     */
    get count(): number {
        return this._creatures.size;
    }

    /**
     * Set a creature as active.
     * Active Creatures are indexed creatures that still need to be monitored for at leat one of the following reasons
     * - creature still have non expired mutating effects (effects that modify a creature state every round)
     * - creature still have active properties (like regeneration) that modifies creature state every round.
     * - creature still have active cooldown on one of its action or spell slot
     * When a creature has no longer running effects or property, or active cooldown,
     * it become inactive and is kicked out of activeCreatures index
     */
    setCreatureActive(creature: Creature): void {
        this._activeCreatures.add(creature);
    }

    /**
     * Return true if creature is active.
     * @see setCreatureActive to know what an active creature is.
     * if the function returns false, then the creature should be kicked out of active creature registry soon
     * as it does no longer satisfies active criteria.
     */
    isCreatureActive(creature: Creature): boolean {
        return false;
    }

    /**
     * Check if any active creature become inactive.
     * Removes inactive creatures from active creature registry
     */
    shrinkActiveCreatureRegistry(): void {
        const tac = this._activeCreatures;
        if (tac.size === 0) {
            return;
        }
        this.activeCreatures.forEach((creature) => {
            if (!this.isCreatureActive(creature)) {
                tac.delete(creature);
            }
        });
    }

    /**
     * Returns all active creatures, in an array
     */
    get activeCreatures(): Creature[] {
        return Array.from(this._activeCreatures);
    }
}
