import z from 'zod';
import { CONSTS } from '../consts';

export const EffectIncapacity = z.strictObject({
    type: z.literal(CONSTS.EFFECT_INCAPACITY),
});
