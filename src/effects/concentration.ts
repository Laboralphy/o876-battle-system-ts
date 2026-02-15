import z from 'zod';
import { CONSTS } from '../consts';

export const EffectConcentration = z.strictObject({
    type: z.literal(CONSTS.EFFECT_CONCENTRATION),
});
