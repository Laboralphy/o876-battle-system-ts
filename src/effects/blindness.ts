import z from 'zod';
import { CONSTS } from '../consts';

export const EffectBlindness = z.strictObject({
    type: CONSTS.EFFECT_BLINDNESS,
});
