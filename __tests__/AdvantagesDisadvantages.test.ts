import { describe, expect, it } from 'vitest';
import { Creature } from '../src/Creature';
import { Attack } from '../src/Attack';
import { computeAttackRollAdvantages } from '../src/adv-dis';
import { CONSTS } from '../src/consts';

describe('computeAttackRollAdvantages', () => {
    it('should return no adv and no dis to creature with no effect or properties', () => {
        const creature = new Creature('c1');
        const target = new Creature('t1');
        const attack = new Attack(creature, target);
        const r = computeAttackRollAdvantages(attack);
        expect(r.advantages.size).toBe(0);
        expect(r.disadvantages.size).toBe(0);
    });
    it('should return ADV_ATTACK_ROLL_UNDETECTED_BY_TARGET when applying invisibility', () => {
        const creature = new Creature('c1');
        const target = new Creature('t1');

        creature.applyEffect(
            {
                type: CONSTS.EFFECT_INVISIBILITY,
            },
            creature,
            10
        );

        const attack = new Attack(creature, target);
        const r = computeAttackRollAdvantages(attack);
        expect(r.advantages.size).toBe(1);
        expect(r.disadvantages.size).toBe(0);
        expect(Array.from(r.advantages).at(0)).toBe(CONSTS.ADV_ATTACK_ROLL_UNDETECTED_BY_TARGET);
    });
    it('should return ADV_ATTACK_ROLL_TARGET_DISABLED & ADV_ATTACK_ROLL_TARGET_RESTRAINED when target has a paralysis effect', () => {
        const creature = new Creature('c1');
        const target = new Creature('t1');
        target.applyEffect(
            {
                type: CONSTS.EFFECT_PARALYSIS,
            },
            creature,
            10
        );
        const attack = new Attack(creature, target);
        const r = computeAttackRollAdvantages(attack);
        expect(r.advantages.size).toBe(2);
        expect(r.disadvantages.size).toBe(0);
        expect(r.advantages.has(CONSTS.ADV_ATTACK_ROLL_TARGET_DISABLED)).toBe(true);
        expect(r.advantages.has(CONSTS.ADV_ATTACK_ROLL_TARGET_RESTRAINED)).toBe(true);
    });
});
