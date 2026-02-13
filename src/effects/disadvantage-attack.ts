import z from 'zod';
import { CONSTS } from '../consts';
import { AttackTypeSchema } from '../schemas/enums/AttackType';

/**
 * Schema definition for DisadvantageAttack.
 * Imposes disadvantage to physical attacks.
 * Disadvantage can be restricted to a certain type of attack.
 * - `attackType`: An optional field defining the type of attack. This field must conform
 *   to the `AttackTypeSchema` if provided.
 */
export const EffectDisadvantageAttack = z.strictObject({
    type: z.literal(CONSTS.EFFECT_DISADVANTAGE_ATTACK).describe('fields.propertyType'),
    attackType: AttackTypeSchema.optional(),
});
