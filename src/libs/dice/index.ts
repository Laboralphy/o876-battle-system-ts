const REGEX_XDY = /^([-+]?)\s*(\d+)\s*[Dd]\s*(\d+)\s*(([-+])\s*(\d+))?$/;
const REGEX_NUM = /^([-+]?)\s*(\d+)\s*$/;

export type EvaluatedFormula = { count: number; sides: number; modifier: number };

/**
 * @class
 */
class Dice {
    private cachexdy = new Map<string, EvaluatedFormula>();
    public debug: boolean = false;
    public forceValue: number = -1;
    constructor() {}

    cheat(value: number) {
        this.debug = true;
        this.forceValue = Math.max(0, Math.min(1, value));
    }

    cheatOff() {
        this.debug = false;
        this.forceValue = -1;
    }

    /**
     * random function
     */
    random(): number {
        return this.debug ? this.forceValue : Math.random();
    }

    private rollDice(sides: number, count: number = 1): number {
        if (count < 0) {
            return -this.rollDice(sides, -count);
        }
        let n = 0;
        for (let i = 0; i < count; i++) {
            n += ((this.random() * sides) | 0) + 1;
        }
        return n;
    }

    parse(sFormula: string): EvaluatedFormula {
        const rxdy = sFormula.match(REGEX_XDY);
        if (!rxdy) {
            throw new Error(`invalid dice formula: ${sFormula}`);
        }
        const [, sSign, sCount, sSides, , sModifierSign = '+', sModifier = '0'] = rxdy;
        const nSign = sSign === '-' ? -1 : 1;
        const nModifierSign = sModifierSign === '-' ? -1 : 1;
        return {
            count: nSign * parseInt(sCount),
            sides: parseInt(sSides),
            modifier: nModifierSign * parseInt(sModifier),
        };
    }

    roll(sFormula: string): number {
        const oFormula = this.cachexdy.get(sFormula);
        if (oFormula) {
            return this.rollDice(oFormula.sides, oFormula.count) + oFormula.modifier;
        } else {
            const rnum = sFormula.match(REGEX_NUM);
            if (rnum) {
                return parseInt(sFormula);
            }
            const oEvaluatedFormula = this.parse(sFormula);
            this.cachexdy.set(sFormula, oEvaluatedFormula);
            return (
                this.rollDice(oEvaluatedFormula.sides, oEvaluatedFormula.count) +
                oEvaluatedFormula.modifier
            );
        }
    }
}
