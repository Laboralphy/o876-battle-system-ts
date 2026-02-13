import z from 'zod';
import { CONSTS } from '../consts';
import { AbilitySchema } from '../schemas/enums/Ability';

/**
 * The creature is weakened by a certain ability score, all attacks that are done with a certain
 * ability are halved in efficiency.
 */
export const EffectEnfeeblement = z.strictObject({
    type: z.literal(CONSTS.EFFECT_ENFEEBLEMENT).describe('fields.propertyType'),
    ability: AbilitySchema,
});
