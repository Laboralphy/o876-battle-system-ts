import { it, describe, expect } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';

describe(`getAbilityScore`, () => {
    it('should return 10 to all abilities', () => {
        const c = new Creature();
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_STRENGTH]).toBe(10);
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_DEXTERITY]).toBe(10);
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_CONSTITUTION]).toBe(10);
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_INTELLIGENCE]).toBe(10);
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_WISDOM]).toBe(10);
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_CHARISMA]).toBe(10);
    });
    it('should return 12 to strength when adding ability modifier property strength +2', () => {
        const c = new Creature();
        c.addInnateProperty({
            type: CONSTS.PROPERTY_ABILITY_MODIFIER,
            amp: 2,
            ability: CONSTS.ABILITY_STRENGTH,
        });
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_STRENGTH]).toBe(12);
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_DEXTERITY]).toBe(10);
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_CONSTITUTION]).toBe(10);
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_INTELLIGENCE]).toBe(10);
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_WISDOM]).toBe(10);
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_CHARISMA]).toBe(10);
    });
    it('should return 13 strength when adding ability modifier property strength +2 and effect +1', () => {
        const c = new Creature();
        c.addInnateProperty({
            type: CONSTS.PROPERTY_ABILITY_MODIFIER,
            amp: 2,
            ability: CONSTS.ABILITY_STRENGTH,
        });
        c.applyEffect(
            {
                type: CONSTS.EFFECT_ABILITY_MODIFIER,
                amp: 1,
                ability: CONSTS.ABILITY_STRENGTH,
            },
            c,
            10
        );
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_STRENGTH]).toBe(13);
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_DEXTERITY]).toBe(10);
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_CONSTITUTION]).toBe(10);
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_INTELLIGENCE]).toBe(10);
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_WISDOM]).toBe(10);
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_CHARISMA]).toBe(10);
    });
});
