import z from 'zod';
import { CONSTS } from '../consts';
import { DamageTypeSchema } from '../schemas/enums/DamageType';
import { AmpExpression } from '../schemas/AmpExpression';

/**
 * This property reduce damage of a certain type
 * The amp may be a dice expression
 */
export const PropertyDamageReduction = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_DAMAGE_REDUCTION),
    amp: AmpExpression,
    damageType: DamageTypeSchema,
});
