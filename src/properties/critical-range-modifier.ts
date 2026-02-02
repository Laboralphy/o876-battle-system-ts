import z from 'zod';
import { CONSTS } from '../consts';
import { AttackTypeSchema } from '../schemas/enums/AttackType';

/**
 * This property will augment or reduce the critical range of a weapon.
 * This property is usually applied on weapon
 */
export const PropertyCriticalRangeModifier = z.object({
    type: z.literal(CONSTS.PROPERTY_CRITICAL_RANGE_MODIFIER),
    amp: z.number().int().describe('fields.amp'),
    attackType: AttackTypeSchema.optional(),
});
