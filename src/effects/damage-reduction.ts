import z from 'zod';
import { CONSTS } from '../consts';
import { DamageTypeSchema } from '../schemas/enums/DamageType';
import { DiceExpression } from '../schemas/DiceExpression';

/**
 * This property reduce damage of a certain type
 * The amp may be a dice expression
 */
export const EffectDamageReduction = z.strictObject({
    type: z.literal(CONSTS.EFFECT_DAMAGE_REDUCTION),
    amp: DiceExpression.or(z.number().int()),
    damageType: DamageTypeSchema,
});
