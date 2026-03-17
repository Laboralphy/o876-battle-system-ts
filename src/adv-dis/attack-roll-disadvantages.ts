import { Disadvantage } from '../schemas/enums/Disadvantage';
import { Attack } from '../Attack';
import { CONSTS } from '../consts';
import { disAttackRollBadEquipment } from './attack-roll/dis/dis-attack-roll-bad-equipment';
import { disAttackRollFrightened } from './attack-roll/dis/dis-attack-roll-frightened';
import { disAttackRollPoisoned } from './attack-roll/dis/dis-attack-roll-poisoned';
import { disAttackRollTargetProtected } from './attack-roll/dis/dis-attack-roll-target-protected';
import { disAttackRollRestrained } from './attack-roll/dis/dis-attack-roll-restrained';
import { disAttackRollTargetUndetected } from './attack-roll/dis/dis-attack-roll-target-undetected';
import { disAttackRollWindyEnvironment } from './attack-roll/dis/dis-attack-roll-windy-environment';

export const ATTACK_ROLL_DISADVANTAGES: Record<Disadvantage, (attack: Attack) => boolean> = {
    [CONSTS.DIS_ATTACK_ROLL_BAD_EQUIPMENT]: disAttackRollBadEquipment,
    [CONSTS.DIS_ATTACK_ROLL_FRIGHTENED]: disAttackRollFrightened,
    [CONSTS.DIS_ATTACK_ROLL_POISONED]: disAttackRollPoisoned,
    [CONSTS.DIS_ATTACK_ROLL_PROPERTY_EFFECT]: disAttackRollTargetProtected,
    [CONSTS.DIS_ATTACK_ROLL_RESTRAINED]: disAttackRollRestrained,
    [CONSTS.DIS_ATTACK_ROLL_TARGET_PROTECTED]: disAttackRollTargetProtected,
    [CONSTS.DIS_ATTACK_ROLL_TARGET_UNDETECTED]: disAttackRollTargetUndetected,
    [CONSTS.DIS_ATTACK_ROLL_WINDY_ENVIRONMENT]: disAttackRollWindyEnvironment,
};
