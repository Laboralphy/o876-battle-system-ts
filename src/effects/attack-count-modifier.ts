import z from 'zod';
import { CONSTS } from '../consts';
import { AttackTypeSchema } from '../schemas/enums/AttackType';

/**
 * Augment or reduce the number of attacks in a turn. Can be restricted to a certain attack type (melee or ranged)
 */
export const EffectAttackCountModifier = z.strictObject({
    type: z.literal(CONSTS.EFFECT_ATTACK_COUNT_MODIFIER),
    attackType: AttackTypeSchema.optional().default(CONSTS.ATTACK_TYPE_ANY),
    amp: z.number().int().describe('fields.amp'),
});
