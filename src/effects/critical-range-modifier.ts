import z from 'zod';
import { CONSTS } from '../consts';
import { AttackTypeSchema } from '../schemas/enums/AttackType';

/**
 * This property will augment or reduce the critical range of a weapon.
 * This property is usually applied on weapon
 */
export const EffectCriticalRangeModifier = z.strictObject({
    type: z.literal(CONSTS.EFFECT_CRITICAL_RANGE_MODIFIER),
    amp: z.number().int().describe('fields.amp'),
    attackType: AttackTypeSchema.optional(),
});
