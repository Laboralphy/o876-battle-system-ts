import z from 'zod';
import { CONSTS } from '../consts';

export const EffectConcentration = z.strictObject({
    type: CONSTS.EFFECT_CONCENTRATION,
});
