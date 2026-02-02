import z from 'zod';
import { CONSTS } from '../consts';
import { AttackTypeSchema } from '../schemas/enums/AttackType';

/**
 * Augment or reduce the number of attacks in a turn. Can be restricted to a certain attack type (melee or ranged)
 */
export const PropertyAttackCountModifier = z.object({
    type: z.literal(CONSTS.PROPERTY_ATTACK_COUNT_MODIFIER),
    attackType: AttackTypeSchema.optional(),
    amp: z.number().int().describe('fields.amp'),
});
