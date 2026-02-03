import z from 'zod';
import { CONSTS } from '../consts';
import { AbilitySchema } from '../schemas/enums/Ability';

/**
 * This property modifies an ability score
 * On the specified ability :
 * - if amp is positive this property grants a bonus
 * - if amp is negative this property imposes a malus
 */
export const PropertyAbilityModifier = z
    .strictObject({
        type: z.literal(CONSTS.PROPERTY_ABILITY_MODIFIER).describe('fields.propertyType'),
        amp: z.number().int().describe('fields.amp'),
        ability: AbilitySchema,
    })
    .describe('property.abilityModifer');
