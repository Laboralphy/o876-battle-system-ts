import { describe, expect, it } from 'vitest';
import { EntityManager } from '../src/EntityManager';
import { CONSTS } from '../src/consts';
import { Item } from '../src/schemas/Item';

describe('EntityBuilder item creation', () => {
    it('should create short sword', () => {
        const ef = new EntityManager();
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
    it('action hsould have 0 to all optional properties in action section', () => {
        const ef = new EntityManager();
        const c = ef.createCreature('c-mummy', 'm');
        expect(c.state.actions[0].blueprint.cooldown).toBe(6);
        expect(c.state.actions[0].blueprint.charges).toBe(0);
        expect(c.state.actions[0].blueprint.rechargeDelay).toBe(0);
    })
});
