import z from 'zod';
import { CONSTS } from '../consts';
import { AbilitySchema } from '../schemas/enums/Ability';

/**
 * This property modifies an ability check,
 * Currently an ability is required; there is no universal ability check modifier
 *
 * When applied to a creature as innate property or on an item equipped by a creature
 * This will hook each ability check of the creature to the specified ability
 *
 * When : throwing an ability check
 */
export const PropertyAbilityCheckModifier = z
    .strictObject({
        type: z.literal(CONSTS.PROPERTY_ABILITY_CHECK_MODIFIER).describe('fields.propertyType'),
        amp: z.number().int().describe('fields.amp'),
        ability: AbilitySchema,
    })
    .describe('property.abilityCheckModifier');
