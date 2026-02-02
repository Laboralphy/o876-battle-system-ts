import z from 'zod';
import { CONSTS } from '../consts';
import { DamageTypeSchema } from '../schemas/enums/DamageType';
import { DiceExpression } from '../schemas/DiceExpression';

/**
 * This property modifies to output damage of a certain type
 * The amp may be a dice expression
 */
export const PropertyDamageImmunity = z.object({
    type: z.literal(CONSTS.PROPERTY_DAMAGE_IMMUNITY),
    amp: DiceExpression,
    damageType: DamageTypeSchema,
});
