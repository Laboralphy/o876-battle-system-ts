import { AttackType } from '../../schemas/enums/AttackType';
import { CONSTS } from '../../consts';
import { DamageType } from '../../schemas/enums/DamageType';
import { Ability } from '../../schemas/enums/Ability';

type HavingAttackType = {
    attackType: AttackType;
};

type HavingDamageType = {
    damageType: DamageType;
};

type HavingAbility = {
    ability?: Ability;
};

/**
 * Returns true if effect or prop, having attackType property of value ATTACK_TYPE_MELEE or ATTACK_TYPE_ANY
 * @param effectOrProp effect or prop having attackType property
 */
export function filterMeleeAttackTypes(effectOrProp: HavingAttackType): boolean {
    return (
        effectOrProp.attackType === CONSTS.ATTACK_TYPE_MELEE ||
        effectOrProp.attackType === CONSTS.ATTACK_TYPE_ANY
    );
}

/**
 * Returns true if effect or prop has an attackType of Ranged or Any
 * @param effectOrProp
 */
export function filterRangedAttackTypes(effectOrProp: HavingAttackType): boolean {
    return (
        effectOrProp.attackType === CONSTS.ATTACK_TYPE_RANGED ||
        effectOrProp.attackType === CONSTS.ATTACK_TYPE_ANY
    );
}

export function filterSlashingDamageTypes(effectOrProp: HavingDamageType): boolean {
    return (
        effectOrProp.damageType === CONSTS.DAMAGE_TYPE_SLASHING ||
        effectOrProp.damageType === CONSTS.DAMAGE_TYPE_ANY
    );
}

export function filterPiercingDamageTypes(effectOrProp: HavingDamageType): boolean {
    return (
        effectOrProp.damageType === CONSTS.DAMAGE_TYPE_PIERCING ||
        effectOrProp.damageType === CONSTS.DAMAGE_TYPE_ANY
    );
}

export function filterCrushingDamageTypes(effectOrProp: HavingDamageType): boolean {
    return (
        effectOrProp.damageType === CONSTS.DAMAGE_TYPE_CRUSHING ||
        effectOrProp.damageType === CONSTS.DAMAGE_TYPE_ANY
    );
}

export function filterAbility(effectOrProp: HavingAbility): Ability {
    if ('ability' in effectOrProp && effectOrProp.ability) {
        return effectOrProp.ability;
    } else {
        throw new Error('effectOrProp must be an object with an ability property');
    }
}
