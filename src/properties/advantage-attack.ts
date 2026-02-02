import z from 'zod';
import { CONSTS } from '../consts';
import { AttackTypeSchema } from '../schemas/enums/AttackType';

/**
 * Schema definition for AdvantageAttack.
 * Gives advantage to physical attacks.
 * Advantage can be restricted to a certain type of attack.
 * - `attackType`: An optional field defining the type of attack. This field must conform
 *   to the `AttackTypeSchema` if provided.
 */
export const PropertyAdvantageAttackSchema = z.object({
    type: z.literal(CONSTS.PROPERTY_ADVANTAGE_ATTACK).describe('fields.propertyType'),
    attackType: AttackTypeSchema.optional(),
});
