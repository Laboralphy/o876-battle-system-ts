import z from 'zod';
import CONSTS from '../consts';
import { AbilitySchema } from '../schemas/enums/ability';

/**
 * This property modifies an ability check
 */
export const PropertyAbilityCheckModifierSchema = z
    .strictObject({
        type: z.literal(CONSTS.PROPERTY_ABILITY_CHECK_MODIFIER).describe('fields.propertyType'),
        amp: z.number().int().describe('fields.amp'),
    })
    .and(
        z.union([
            z.object({
                ability: z.literal(''),
                universal: z.literal(true),
            }),
            z.object({
                ability: AbilitySchema,
                universal: z.literal(false).optional(),
            }),
        ])
    )
    .describe('property.abilityModifer');
