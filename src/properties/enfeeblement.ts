import z from 'zod';
import { CONSTS } from '../consts';
import { AbilitySchema } from '../schemas/enums/Ability';

/**
 * The creature is weakened by a certain ability score, all attacks that are done with a certain
 * ability are halved in efficiency.
 */
export const PropertyEnfeeblement = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_ENFEEBLEMENT).describe('fields.propertyType'),
    ability: AbilitySchema,
});
