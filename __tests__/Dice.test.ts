import { Dice } from '../src/libs/dice';

describe('Dice class', () => {
    let dice: Dice;

    beforeEach(() => {
        dice = new Dice();
    });

    describe('cheat and random', () => {
        it('should return a random number when debug is false', () => {
            const val = dice.random();
            expect(val).toBeGreaterThanOrEqual(0);
            expect(val).toBeLessThan(1);
        });

        it('should return forced value when cheat is enabled', () => {
            dice.cheat(0.5);
            expect(dice.debug).toBe(true);
            expect(dice.forceValue).toBe(0.5);
            expect(dice.random()).toBe(0.5);
        });

        it('should clamp cheat value between 0 and 1', () => {
            dice.cheat(-1);
            expect(dice.forceValue).toBe(0);
            dice.cheat(2);
            expect(dice.forceValue).toBe(1);
        });

        it('should disable cheat mode when cheatOff is called', () => {
            dice.cheat(0.5);
            dice.cheatOff();
            expect(dice.debug).toBe(false);
            expect(dice.forceValue).toBe(-1);
            const val = dice.random();
            expect(val).not.toBe(0.5);
        });
    });

    describe('parse', () => {
        it('should parse simple formula like 2d6', () => {
            const result = dice.parse('2d6');
            expect(result).toEqual({ count: 2, sides: 6, modifier: 0 });
        });

        it('should parse formula with modifier like 1d20+5', () => {
            const result = dice.parse('1d20+5');
            expect(result).toEqual({ count: 1, sides: 20, modifier: 5 });
        });

        it('should parse formula with negative modifier like 3d4-2', () => {
            const result = dice.parse('3d4-2');
            expect(result).toEqual({ count: 3, sides: 4, modifier: -2 });
        });

        it('should parse formula with negative count like -1d6', () => {
            const result = dice.parse('-1d6');
            expect(result).toEqual({ count: -1, sides: 6, modifier: 0 });
        });

        it('should throw error for invalid formula', () => {
            expect(() => dice.parse('invalid')).toThrow('invalid dice formula: invalid');
        });

        it('should handle spaces in formula', () => {
            const result = dice.parse(' 2 d 10 + 3 ');
            expect(result).toEqual({ count: 2, sides: 10, modifier: 3 });
        });
    });

    describe('roll', () => {
        it('should roll a simple numeric string', () => {
            expect(dice.roll('10')).toBe(10);
            expect(dice.roll('-5')).toBe(-5);
        });

        it('should roll formula correctly using cheat to predict outcome', () => {
            // formula: 2d6 + 3
            // cheat(0.5) => (0.5 * 6 | 0) + 1 = 3 + 1 = 4
            // 2 dice => 4 + 4 = 8
            // 8 + 3 = 11
            dice.cheat(0.5);
            expect(dice.roll('2d6+3')).toBe(11);
        });

        it('should roll formula correctly with 0 cheat', () => {
            // formula: 1d6
            // cheat(0) => (0 * 6 | 0) + 1 = 1
            dice.cheat(0);
            expect(dice.roll('1d6')).toBe(1);
        });

        it('should roll formula correctly with 0.99 cheat', () => {
            // formula: 1d6
            // cheat(0.99) => (0.99 * 6 | 0) + 1 = 5 + 1 = 6
            dice.cheat(0.99);
            expect(dice.roll('1d6')).toBe(6);
        });

        it('should use cache for subsequent rolls of the same formula', () => {
            const parseSpy = jest.spyOn(dice, 'parse');
            dice.roll('2d6');
            dice.roll('2d6');
            expect(parseSpy).toHaveBeenCalledTimes(1);
        });

        it('should handle negative dice counts in roll', () => {
            // -2d6 with cheat(0.5) => - (rollDice(6, 2)) = - (4 + 4) = -8
            dice.cheat(0.5);
            expect(dice.roll('-2d6')).toBe(-8);
        });
    });
});
