import z from 'zod';
import { CONSTS } from '../consts';
import { DamageTypeSchema } from '../schemas/enums/DamageType';
import { DiceExpression } from '../schemas/DiceExpression';

/**
 * This property modifies to output damage of a certain type
 * The amp may be a dice expression
 */
export const EffectDamageModifier = z.strictObject({
    type: z.literal(CONSTS.EFFECT_DAMAGE_MODIFIER),
    amp: DiceExpression.or(z.number().int()),
    damageType: DamageTypeSchema,
});
