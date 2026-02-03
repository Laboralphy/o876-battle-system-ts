import z from 'zod';
import { CONSTS } from '../consts';
import { DamageTypeSchema } from '../schemas/enums/DamageType';
import { DiceExpression } from '../schemas/DiceExpression';

/**
 * When applied on a weapon, the property grants the creature the ability to convert dealt damage into health
 * This can be restricted to certain damage types
 */
export const PropertyVampyre = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_DAMAGE_MODIFIER),
    amp: DiceExpression.or(z.number().int()),
    damageType: DamageTypeSchema,
});
