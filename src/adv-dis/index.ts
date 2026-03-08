import { advAttackRollPropertyEffect } from './attack-roll/adv/adv-attack-roll-property-effect';
import { advAttackRollTargetDisabled } from './attack-roll/adv/adv-attack-roll-target-disabled';
import { advAttackRollTargetRestrained } from './attack-roll/adv/adv-attack-roll-target-restrained';
import { advAttackRollUndetectedByTarget } from './attack-roll/adv/adv-attack-roll-undetected-by-target';
import { disAttackRollBadEquipment } from './attack-roll/dis/dis-attack-roll-bad-equipment';
import { disAttackRollFrightened } from './attack-roll/dis/dis-attack-roll-frightened';
import { disAttackRollPoisoned } from './attack-roll/dis/dis-attack-roll-poisoned';
import { disAttackRollRestrained } from './attack-roll/dis/dis-attack-roll-restrained';
import { disAttackRollTargetProtected } from './attack-roll/dis/dis-attack-roll-target-protected';
import { disAttackRollTargetUndetected } from './attack-roll/dis/dis-attack-roll-target-undetected';
import { disAttackRollWindyEnvironment } from './attack-roll/dis/dis-attack-roll-windy-environment';
import { advSavingThrowPropertyEffect } from './saving-throw/adv/adv-saving-throw-property-effect';
import { disSavingThrowImpededMobility } from './saving-throw/dis/dis-saving-throw-impeded-mobility';
import { disSavingThrowPropertyEffect } from './saving-throw/dis/dis-saving-throw-property-effect';
import { Attack } from '../Attack';
import { Advantage } from '../schemas/enums/Advantage';
import { CONSTS } from '../consts';
import { Disadvantage } from '../schemas/enums/Disadvantage';
import { SavingThrowOutcome } from '../SavingThrowOutcome';

const ADV_ATTACK_ROLL_DEFINITION: Record<Advantage, (attack: Attack) => boolean> = {
    [CONSTS.ADV_ATTACK_ROLL_PROPERTY_EFFECT]: advAttackRollPropertyEffect,
    [CONSTS.ADV_ATTACK_ROLL_TARGET_DISABLED]: advAttackRollTargetDisabled,
    [CONSTS.ADV_ATTACK_ROLL_TARGET_RESTRAINED]: advAttackRollTargetRestrained,
    [CONSTS.ADV_ATTACK_ROLL_UNDETECTED_BY_TARGET]: advAttackRollUndetectedByTarget,
};

const ADV_SAVING_THROW_DEFINITION: Record<
    Advantage,
    (savingThrowOutcome: SavingThrowOutcome) => boolean
> = {
    [CONSTS.ADV_SAVING_THROW_PROPERTY_EFFECT]: advSavingThrowPropertyEffect,
};

const DIS_ATTACK_ROLL_DEFINITION: Record<Disadvantage, (attack: Attack) => boolean> = {
    [CONSTS.DIS_ATTACK_ROLL_BAD_EQUIPMENT]: disAttackRollBadEquipment,
    [CONSTS.DIS_ATTACK_ROLL_FRIGHTENED]: disAttackRollFrightened,
    [CONSTS.DIS_ATTACK_ROLL_POISONED]: disAttackRollPoisoned,
    [CONSTS.DIS_ATTACK_ROLL_PROPERTY_EFFECT]: disAttackRollTargetProtected,
    [CONSTS.DIS_ATTACK_ROLL_RESTRAINED]: disAttackRollRestrained,
    [CONSTS.DIS_ATTACK_ROLL_TARGET_PROTECTED]: disAttackRollTargetProtected,
    [CONSTS.DIS_ATTACK_ROLL_TARGET_UNDETECTED]: disAttackRollTargetUndetected,
    [CONSTS.DIS_ATTACK_ROLL_WINDY_ENVIRONMENT]: disAttackRollWindyEnvironment,
};

const DIS_SAVING_THROW_DEFINITION: Record<
    Disadvantage,
    (savingThrowOutcome: SavingThrowOutcome) => boolean
> = {
    [CONSTS.DIS_SAVING_THROW_IMPEDED_MOBILITY]: disSavingThrowImpededMobility,
    [CONSTS.DIS_SAVING_THROW_PROPERTY_EFFECT]: disSavingThrowPropertyEffect,
};

export function computeAttackRollAdvantages(attack: Attack) {
    const adv = new Set<Advantage>();
    for (const [advantage, f] of Object.entries(ADV_ATTACK_ROLL_DEFINITION)) {
        if (f(attack)) {
            adv.add(advantage);
        }
    }
    const dis = new Set<Advantage>();
    for (const [disadvantage, f] of Object.entries(DIS_ATTACK_ROLL_DEFINITION)) {
        if (f(attack)) {
            dis.add(disadvantage);
        }
    }
    return {
        advantages: adv,
        disadvantages: dis,
    };
}

export function computeSavingThrowAdvantages(savingThrowOutcome: SavingThrowOutcome) {
    const adv = new Set<Advantage>();
    for (const [advantage, f] of Object.entries(ADV_SAVING_THROW_DEFINITION)) {
        if (f(savingThrowOutcome)) {
            adv.add(advantage);
        }
    }
    const dis = new Set<Advantage>();
    for (const [disadvantage, f] of Object.entries(DIS_SAVING_THROW_DEFINITION)) {
        if (f(savingThrowOutcome)) {
            dis.add(disadvantage);
        }
    }
    return {
        advantages: adv,
        disadvantages: dis,
    };
}
