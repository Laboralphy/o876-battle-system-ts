import { describe, it, expect } from 'vitest';
import { Creature } from '../src/Creature';
import { CONSTS } from '../src/consts';

describe('Creature', () => {
    it('should create an instance with no error', () => {
        expect(() => new Creature()).not.toThrow();
    });

    it('should return 2 when assigning two ability modifier +1', () => {
        const creature = new Creature();
        creature.addInnateProperty({
            type: CONSTS.PROPERTY_ABILITY_MODIFIER,
            ability: CONSTS.ABILITY_STRENGTH,
            amp: 1,
        });
        creature.addInnateProperty({
            type: CONSTS.PROPERTY_ABILITY_MODIFIER,
            ability: CONSTS.ABILITY_STRENGTH,
            amp: 1,
        });
        const o = creature.aggregate({ properties: { types: [CONSTS.PROPERTY_ABILITY_MODIFIER] } });
        expect(o.sum).toBe(2);
        expect(o.min).toBe(1);
        expect(o.max).toBe(1);
        expect(o.count).toBe(2);
    });
});
