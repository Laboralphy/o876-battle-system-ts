import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';
import { describe, expect, it } from 'vitest';
import { EntityManager } from '../../src/EntityManager';
import { ItemBlueprint, ItemBlueprintSchema } from '../../src/schemas/Item';

describe('GetAbilityModifiers', () => {
    it('Should return modifiers, 1, 0, 3, 0, 1, 2 when setting abilities str: 13, dex: 11, con: 16, int: 10, wis: 12, cha: 14', () => {
        const c = new Creature();
        c.state.abilities[CONSTS.ABILITY_STRENGTH] = 13;
        c.state.abilities[CONSTS.ABILITY_DEXTERITY] = 11;
        c.state.abilities[CONSTS.ABILITY_CONSTITUTION] = 16;
        c.state.abilities[CONSTS.ABILITY_INTELLIGENCE] = 10;
        c.state.abilities[CONSTS.ABILITY_WISDOM] = 12;
        c.state.abilities[CONSTS.ABILITY_CHARISMA] = 14;
        const am = c.getters.getAbilityModifiers;
        expect(am[CONSTS.ABILITY_STRENGTH]).toBe(1);
        expect(am[CONSTS.ABILITY_DEXTERITY]).toBe(0);
        expect(am[CONSTS.ABILITY_CONSTITUTION]).toBe(3);
        expect(am[CONSTS.ABILITY_INTELLIGENCE]).toBe(0);
        expect(am[CONSTS.ABILITY_WISDOM]).toBe(1);
        expect(am[CONSTS.ABILITY_CHARISMA]).toBe(2);
    });

    it('Should return dex modifier 1 when setting ability dex: 11 and equiping with boot of dexterity +1', () => {
        const c = new Creature();
        c.state.abilities[CONSTS.ABILITY_DEXTERITY] = 11;
        const am = c.getters.getAbilityModifiers;
        expect(am[CONSTS.ABILITY_DEXTERITY]).toBe(0);
        const ef = new EntityManager();
        const bootsOfDexBlueprint: ItemBlueprint = ItemBlueprintSchema.parse({
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_BOOTS,
            properties: [
                {
                    type: CONSTS.PROPERTY_ABILITY_MODIFIER,
                    ability: CONSTS.ABILITY_DEXTERITY,
                    amp: 1,
                },
            ],
            weight: 1,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_FEET],
        });
        const bootsOfDex = ef.createItem(bootsOfDexBlueprint);
        c.equipItem(bootsOfDex);
        expect(c.getters.getAbilityModifiers[CONSTS.ABILITY_DEXTERITY]).toBe(1);
    });
});
