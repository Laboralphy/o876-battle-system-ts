import z from 'zod';
import { CONSTS } from '../consts';

export const EffectEnvironment = z.strictObject({
    type: CONSTS.EFFECT_ENVIRONMENT,
    environment: z.string(), // reference of the environment
});
