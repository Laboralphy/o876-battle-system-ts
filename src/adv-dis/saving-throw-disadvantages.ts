import { Disadvantage } from '../schemas/enums/Disadvantage';
import { SavingThrowOutcome } from '../SavingThrowOutcome';
import { CONSTS } from '../consts';
import { disSavingThrowImpededMobility } from './saving-throw/dis/dis-saving-throw-impeded-mobility';
import { disSavingThrowPropertyEffect } from './saving-throw/dis/dis-saving-throw-property-effect';

export const SAVING_THROW_DISADVANTAGES: Record<
    Disadvantage,
    (savingThrowOutcome: SavingThrowOutcome) => boolean
> = {
    [CONSTS.DIS_SAVING_THROW_IMPEDED_MOBILITY]: disSavingThrowImpededMobility,
    [CONSTS.DIS_SAVING_THROW_PROPERTY_EFFECT]: disSavingThrowPropertyEffect,
};
