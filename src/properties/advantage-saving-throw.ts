import z from 'zod';
import { CONSTS } from '../consts';
import { AbilitySchema } from '../schemas/enums/Ability';

/**
 * Schema for advantage on saving throws.
 */
export const AdvantageSavingThrowSchema = z.object({
    type: z.literal(CONSTS.PROPERTY_ADVANTAGE_SAVING_THROW).describe('fields.propertyType'),
    ability: AbilitySchema,
});
