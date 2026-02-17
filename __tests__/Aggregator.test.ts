import { describe, expect, it } from 'vitest';
import { EntityFactory } from '../src/EntityFactory';
import { Creature } from '../src/Creature';
import { CONSTS } from '../src/consts';
import { EffectDefinition, EffectDefinitionSchema } from '../src/effects';
import { Item } from '../src/schemas/Item';

describe('aggregate', () => {
    it('should return 3 when adding 1 property of amp 2 and 1 effect of amp 1', () => {
        const ef = new EntityFactory();
        const gob: Creature = ef.createEntity('c-goblin');
        expect(gob).toBeDefined();
        gob.addInnateProperty({
            type: CONSTS.PROPERTY_ABILITY_MODIFIER,
            amp: 2,
            ability: CONSTS.ABILITY_DEXTERITY,
        });
        const ed: EffectDefinition = EffectDefinitionSchema.parse({
            type: CONSTS.EFFECT_ABILITY_MODIFIER,
            amp: 1,
            ability: CONSTS.ABILITY_DEXTERITY,
        });
        gob.applyEffect(ed, gob, 10, CONSTS.EFFECT_SUBTYPE_MAGICAL, '');
        expect(
            gob.aggregate({
                properties: { types: [CONSTS.PROPERTY_ABILITY_MODIFIER] },
                effects: { types: [CONSTS.EFFECT_ABILITY_MODIFIER] },
            }).sum
        ).toBe(3);
    });

    it('should equip tourist with ability modifier dagger', () => {
        const ef = new EntityFactory();
        const tourist: Creature = ef.createEntity('c-tourist');
        const dagger: Item = ef.createEntity('wpn-dagger');

        tourist.equipItem(dagger);
    });
});
