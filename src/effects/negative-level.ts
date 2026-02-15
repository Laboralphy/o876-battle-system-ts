import z from 'zod';
import { CONSTS } from '../consts';

export const EffectNegativeLevel = z.strictObject({
    type: z.literal(CONSTS.EFFECT_NEGATIVE_LEVEL),
    amp: z.number().int().positive(),
});
