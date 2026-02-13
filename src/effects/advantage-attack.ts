import z from 'zod';
import { CONSTS } from '../consts';
import { AttackTypeSchema } from '../schemas/enums/AttackType';

export const EffectAdvantageAttack = z.strictObject({
    type: z.literal(CONSTS.EFFECT_ADVANTAGE_ATTACK).describe('fields.propertyType'),
    attackType: AttackTypeSchema.optional(),
});
