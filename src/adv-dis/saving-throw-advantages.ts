import { Advantage } from '../schemas/enums/Advantage';
import { SavingThrowOutcome } from '../SavingThrowOutcome';
import { CONSTS } from '../consts';
import { advSavingThrowPropertyEffect } from './saving-throw/adv/adv-saving-throw-property-effect';

export const SAVING_THROW_ADVANTAGES: Record<
    Advantage,
    (savingThrowOutcome: SavingThrowOutcome) => boolean
> = {
    [CONSTS.ADV_SAVING_THROW_PROPERTY_EFFECT]: advSavingThrowPropertyEffect,
};
