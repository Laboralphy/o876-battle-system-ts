import { describe, expect, it } from 'vitest';
import { EntityFactory } from '../src/EntityFactory';
import { CONSTS } from '../src/consts';
import { Item } from '../src/schemas/Item';

describe('EntityBuilder item creation', () => {
    it('should create short sword', () => {
        const ef = new EntityFactory();
        const shortsword: Item = ef.createEntity('wpn-short-sword');
        ef.addItemProperty(shortsword, {
            type: CONSTS.PROPERTY_DAMAGE_MODIFIER,
            amp: '1d6',
            damageType: CONSTS.DAMAGE_TYPE_PIERCING,
        });
        expect(shortsword.properties[0]).toMatchObject({
            amp: '1d6',
            damageType: 'DAMAGE_TYPE_PIERCING',
            type: 'PROPERTY_DAMAGE_MODIFIER',
        });
    });
});
