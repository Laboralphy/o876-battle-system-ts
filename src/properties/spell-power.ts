import z from 'zod';
import { CONSTS } from '../consts';
import { AbilitySchema } from '../schemas/enums/Ability';

/**
 * This property modifies the spell power : The caster level of a spell cast with the specified ability score
 * is increased by the specified amount
 */
export const PropertySpellPower = z
    .strictObject({
        type: z.literal(CONSTS.PROPERTY_SPELL_POWER).describe('fields.propertyType'),
        amp: z.number().int().describe('fields.amp'),
        ability: AbilitySchema,
    })
    .describe('property.abilityModifer');
