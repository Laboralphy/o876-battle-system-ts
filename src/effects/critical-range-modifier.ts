import z from 'zod';
import { CONSTS } from '../consts';
import { AttackTypeSchema } from '../schemas/enums/AttackType';

/**
 * This Effect will augment or reduce the critical range of a weapon.
 * This Effect is usually applied on weapon
 */
export const EffectCriticalRangeModifier = z.strictObject({
    type: z.literal(CONSTS.EFFECT_CRITICAL_RANGE_MODIFIER),
    amp: z.number().int().describe('fields.amp'),
    attackType: AttackTypeSchema.optional(),
});
