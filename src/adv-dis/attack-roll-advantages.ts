import { Advantage } from '../schemas/enums/Advantage';
import { Attack } from '../Attack';
import { CONSTS } from '../consts';
import { advAttackRollPropertyEffect } from './attack-roll/adv/adv-attack-roll-property-effect';
import { advAttackRollTargetDisabled } from './attack-roll/adv/adv-attack-roll-target-disabled';
import { advAttackRollTargetRestrained } from './attack-roll/adv/adv-attack-roll-target-restrained';
import { advAttackRollUndetectedByTarget } from './attack-roll/adv/adv-attack-roll-undetected-by-target';

export const ATTACK_ROLL_ADVANTAGES: Record<Advantage, (attack: Attack) => boolean> = {
    [CONSTS.ADV_ATTACK_ROLL_PROPERTY_EFFECT]: advAttackRollPropertyEffect,
    [CONSTS.ADV_ATTACK_ROLL_TARGET_DISABLED]: advAttackRollTargetDisabled,
    [CONSTS.ADV_ATTACK_ROLL_TARGET_RESTRAINED]: advAttackRollTargetRestrained,
    [CONSTS.ADV_ATTACK_ROLL_UNDETECTED_BY_TARGET]: advAttackRollUndetectedByTarget,
};
