import { Dice } from './libs/dice';

/**
 * Represents a single dice roll session, handling formulas, modifiers,
 * and advantage/disadvantage mechanics.
 */
export class DiceRoll {
    readonly #roll: number = 0;
    readonly #dice = new Dice();
    readonly #formula: string = '1d20';
    #altRoll: number = 0;
    #modifier: number = 0;
    #advantage: boolean = false;
    #disadvantage: boolean = false;

    constructor(formula: string) {
        this.#formula = formula;
        this.#roll = this.doRoll();
    }

    /**
     * Executes a dice roll based on the current formula.
     * @returns {number} The result of the dice roll.
     */
    doRoll(): number {
        return this.#dice.roll(this.#formula);
    }

    /**
     * Gets whether the roll has advantage.
     * @returns {boolean} True if advantage is enabled.
     */
    get advantage(): boolean {
        return this.#advantage;
    }

    /**
     * Sets whether the roll has advantage.
     * If enabled, an alternative roll is immediately generated.
     * @param {boolean} value - True to enable advantage.
     */
    set advantage(value: boolean) {
        if (value && this.#altRoll === 0) {
            this.#altRoll = this.doRoll();
        }
        this.#advantage = value;
    }

    /**
     * Gets whether the roll has disadvantage.
     * @returns {boolean} True if disadvantage is enabled.
     */
    get disadvantage(): boolean {
        return this.#disadvantage;
    }

    /**
     * Sets whether the roll has disadvantage.
     * If enabled, an alternative roll is immediately generated.
     * @param {boolean} value - True to enable disadvantage.
     */
    set disadvantage(value: boolean) {
        if (value && this.#altRoll === 0) {
            this.#altRoll = this.doRoll();
        }
        this.#disadvantage = value;
    }

    /**
     * Gets the highest value between the primary roll and the alternative roll.
     * @returns {number} The best roll value.
     */
    get bestRoll(): number {
        return Math.max(this.#roll, this.#altRoll);
    }

    /**
     * Gets the lowest value between the primary roll and the alternative roll.
     * @returns {number} The worst roll value.
     */
    get worseRoll(): number {
        return Math.min(this.#roll, this.#altRoll);
    }

    /**
     * Gets the roll result taking advantage and disadvantage into account.
     * - If both or neither are active, returns the primary roll.
     * - If only advantage is active, returns the best of two rolls.
     * - If only disadvantage is active, returns the worst of two rolls.
     * @returns {number} The effective roll result.
     */
    get roll(): number {
        if (this.#advantage === this.#disadvantage) {
            return this.#roll;
        } else if (this.#advantage) {
            return this.bestRoll;
        } else {
            return this.worseRoll;
        }
    }

    /**
     * Gets the static modifier applied to the roll result.
     * @returns {number} The modifier value.
     */
    get modifier(): number {
        return this.#modifier;
    }

    /**
     * Sets the static modifier to be applied to the roll result.
     * @param {number} value - The modifier value.
     */
    set modifier(value: number) {
        this.#modifier = value;
    }

    /**
     * Gets the total result of the roll including the modifier.
     * @returns {number} The total sum (roll + modifier).
     */
    get total(): number {
        return this.roll + this.#modifier;
    }
}
