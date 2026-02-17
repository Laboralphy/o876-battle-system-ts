import z from 'zod';
import { CONSTS } from '../consts';
import { DamageTypeSchema } from '../schemas/enums/DamageType';
import { AmpExpression } from '../schemas/AmpExpression';

/**
 * When applied on a weapon, the property grants the creature the ability to convert dealt damage into health
 * This can be restricted to certain damage types
 */
export const PropertyDefinitionVampyre = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_VAMPYRE),
    amp: AmpExpression,
    damageType: DamageTypeSchema,
});
