import { Dice } from './libs/dice';

export class DiceRoll {
    #roll: number = 0;
    #altRoll: number = 0;
    #modifier: number = 0;
    #advantage: boolean = false;
    #disadvantage: boolean = false;
    readonly #dice = new Dice();
    #formula: string = '1d20';

    set formula(value: string) {
        this.#formula = value;
    }

    doRoll(): number {
        return this.#dice.roll(this.#formula);
    }

    get advantage(): boolean {
        return this.#advantage;
    }

    set advantage(value: boolean) {
        if (value) {
            this.#altRoll = this.doRoll();
        }
        this.#advantage = value;
    }

    get disadvantage(): boolean {
        return this.#advantage;
    }

    set disadvantage(value: boolean) {
        if (value) {
            this.#altRoll = this.doRoll();
        }
        this.#advantage = value;
    }

    get bestRoll(): number {
        return Math.max(this.#roll, this.#altRoll);
    }

    get worseRoll(): number {
        return Math.min(this.#roll, this.#altRoll);
    }

    get roll(): number {
        if (this.#advantage === this.#disadvantage) {
            return this.#roll;
        } else if (this.#advantage) {
            return this.bestRoll;
        } else {
            return this.worseRoll;
        }
    }

    get total() {
        return this.roll + this.#modifier;
    }
}
