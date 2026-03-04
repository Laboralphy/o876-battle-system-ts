import { Attack } from '../../../Attack';
import { CONSTS } from '../../../consts';
import { aggregate } from '../../../libs/aggregator';
import { Property } from '../../../properties';
import { Effect } from '../../../effects';

/**
 * The attacker has an advantage on attack when having a specific property or effect
 * The attack must have at least one property or one effect that matches this criteria :
 * 1) The attack type must be any or the same as the attack type of the attack
 * 2) The specie must be any or the same as the specie of the attacker
 * @param attack
 */
export function advAttackRollPropertyEffect(attack: Attack): boolean {
    const oAttacker = attack.attacker;
    const sAttackType = attack.attackType;
    const specie = oAttacker.getters.getSpecie;

    /**
     * Filter props/effects that matches the attack type and the attacker specie
     * @param propOrEffect
     */
    const filterOnAttackTypeAndSpecie = (propOrEffect: Effect | Property): boolean => {
        const attackType =
            'attackType' in propOrEffect ? propOrEffect.attackType : CONSTS.ATTACK_TYPE_ANY;
        const specieType = 'specie' in propOrEffect ? propOrEffect.specie : CONSTS.SPECIE_ANY;
        if (attackType !== CONSTS.ATTACK_TYPE_ANY && attackType !== sAttackType) {
            return false;
        }
        return specieType === CONSTS.SPECIE_ANY || specieType === specie;
    };

    /**
     * The advantage is true if there is one or more property or effect that grant attack advantage
     * Property or Effect may be specific to a certain type of creature.
     */
    return (
        aggregate(
            [CONSTS.PROPERTY_ADVANTAGE_ATTACK, CONSTS.EFFECT_ADVANTAGE_ATTACK],
            {
                properties: {
                    filter: filterOnAttackTypeAndSpecie,
                },
                effects: {
                    filter: filterOnAttackTypeAndSpecie,
                },
            },
            oAttacker.getters
        ).count > 0
    );
}
