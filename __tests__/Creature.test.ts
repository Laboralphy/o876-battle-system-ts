import { describe, it, expect } from 'vitest';
import { Creature } from '../src/Creature';
import { CONSTS } from '../src/consts';
import {EventCreatureEquipItem} from "../src/schemas/events/EventCreatureEquipItem";
import {EntityManager} from "../src/EntityManager";

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

    it('should fire an event when equipping an item', () => {
        const c1 = new Creature('c1');
        const aLog = []
        c1.events.on(CONSTS.EVENT_CREATURE_EQUIP_ITEM, ({ creature, item, slot }: EventCreatureEquipItem) => {
            aLog.push({ creature: creature.id, item: item.id, slot });
        })
        const em = new EntityManager();
        const i1 = em.createItem('wpn-dagger', 'dagger');
        c1.equipItem(i1);
        expect(aLog).toHaveLength(1);
        expect(aLog[0].creature).toBe('c1');
        expect(aLog[0].item).toBe('dagger');
        expect(aLog[0].slot).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
    })

    it('should fire an event when unequipping an item', () => {
        const c1 = new Creature('c1');
        const aLog = []
        c1.events.on(CONSTS.EVENT_CREATURE_REMOVE_ITEM, ({ creature, item, slot }: EventCreatureEquipItem) => {
            aLog.push({ creature: creature.id, item: item.id, slot });
        })
        const em = new EntityManager();
        const i1 = em.createItem('wpn-dagger', 'dagger');
        c1.equipItem(i1);
        expect(aLog).toHaveLength(0);
        c1.unequipItem(i1);
        expect(aLog).toHaveLength(1);
        expect(aLog[0].creature).toBe('c1');
        expect(aLog[0].item).toBe('dagger');
        expect(aLog[0].slot).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
        const i2 = em.createItem('wpn-club', 'club');
        c1.equipItem(i2);
        expect(aLog).toHaveLength(2);
        expect(aLog[1].creature).toBe('c1');
        expect(aLog[1].item).toBe('club');
        expect(aLog[1].slot).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
    })
});
