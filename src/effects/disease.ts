import z from 'zod';
import { CONSTS } from '../consts';

export const EffectDisease = z.strictObject({
    type: z.literal(CONSTS.EFFECT_DISEASE),
    disease: z.string(), // reference of the disease
});
