import z from 'zod';
import { CONSTS } from '../consts';
import { AbilitySchema } from '../schemas/enums/Ability';
import { ThreatTypeSchema } from '../schemas/enums/ThreatType';

/**
 * Schema for disadvantage on saving throws.
 */
export const PropertyDefinitionDisadvantageSavingThrow = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_DISADVANTAGE_SAVING_THROW).describe('fields.propertyType'),
    ability: AbilitySchema,
    threat: ThreatTypeSchema.optional(),
});
