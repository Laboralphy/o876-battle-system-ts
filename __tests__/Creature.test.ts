import { describe, it, expect } from 'vitest';
import { Creature } from '../src/Creature';
import { CONSTS } from '../src/consts';
import { EventCreatureEquipItem } from '../src/schemas/events/EventCreatureEquipItem';
import { EntityManager } from '../src/EntityManager';
import { EquipmentSlot } from '../src/schemas/enums/EquipmentSlot';

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
        const o = creature.aggregate([CONSTS.PROPERTY_ABILITY_MODIFIER], {});
        expect(o.sum).toBe(2);
        expect(o.min).toBe(1);
        expect(o.max).toBe(1);
        expect(o.count).toBe(2);
    });

    it('should fire an event when equipping an item', () => {
        const c1 = new Creature('c1');
        const aLog: { creature: string; item: string; slot: EquipmentSlot }[] = [];
        c1.events.on(
            CONSTS.EVENT_CREATURE_EQUIP_ITEM,
            ({ creature, item, slot }: EventCreatureEquipItem) => {
                aLog.push({ creature: creature.id, item: item.id, slot });
            }
        );
        const em = new EntityManager();
        const i1 = em.createItem('wpn-dagger', 'dagger');
        c1.equipItem(i1);
        expect(aLog).toHaveLength(1);
        expect(aLog[0].creature).toBe('c1');
        expect(aLog[0].item).toBe('dagger');
        expect(aLog[0].slot).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
    });

    it('should fire an event when unequipping an item', () => {
        const c1 = new Creature('c1');
        const aLog: { creature: string; item: string; slot: EquipmentSlot }[] = [];
        c1.events.on(
            CONSTS.EVENT_CREATURE_REMOVE_ITEM,
            ({ creature, item, slot }: EventCreatureEquipItem) => {
                aLog.push({ creature: creature.id, item: item.id, slot });
            }
        );
        const em = new EntityManager();
        const i1 = em.createItem('wpn-dagger', 'dagger');
        c1.equipItem(i1);
        expect(aLog).toHaveLength(0);
        c1.unequipItem(i1);
        expect(aLog).toHaveLength(1);
        expect(aLog[0].creature).toBe('c1');
        expect(aLog[0].item).toBe('dagger');
        expect(aLog[0].slot).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
        c1.equipItem(i1);
        const i2 = em.createItem('wpn-club', 'club');
        const ex = c1.equipItem(i2);
        expect(ex.outcome).toBe(CONSTS.EQUIP_ITEM_SUCCESS);
        expect(ex.equippedItem).toEqual(i2);
        expect(ex.unequippedItem).toEqual(i1);
        expect(aLog).toHaveLength(2);
        expect(aLog[1].creature).toBe('c1');
        expect(aLog[1].item).toBe('dagger'); // dagger as been unequipped, to equip club
        expect(aLog[1].slot).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
    });
});

describe('Creature getVisibility', () => {
    it('should return VISIBLE when two creature are created', () => {
        const c1 = new Creature('c1');
        const c2 = new Creature('c2');
        expect(c1.getCreatureVisibility(c2)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
    });
});
