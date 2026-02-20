import {Creature} from "../../src/Creature";
import {CONSTS} from "../../src/consts";

describe('GetAbilityBaseScores', () => {
    it('should return strength 10, even with property ability modifier', () => {
        const c = new Creature();
        c.addInnateProperty({
            type: CONSTS.PROPERTY_ABILITY_MODIFIER,
            amp: 2,
            ability: CONSTS.ABILITY_STRENGTH
        });
        expect(c.getters.getAbilityBaseScores[CONSTS.ABILITY_STRENGTH]).toBe(10);
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_STRENGTH]).toBe(12);
    });
});
