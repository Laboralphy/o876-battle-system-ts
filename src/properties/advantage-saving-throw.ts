import z from 'zod';
import { CONSTS } from '../consts';
import { AbilitySchema } from '../schemas/enums/Ability';
import { ThreatTypeSchema } from '../schemas/enums/ThreatType';
import { SpecieSchema } from '../schemas/enums/Specie';

/**
 * Schema for advantage on saving throws.
 *
 * when : rolling a saving throw
 */
export const PropertyDefinitionAdvantageSavingThrow = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_ADVANTAGE_SAVING_THROW).describe('fields.propertyType'),
    ability: AbilitySchema,
    threat: ThreatTypeSchema.optional(),
    specie: SpecieSchema.optional(),
});
