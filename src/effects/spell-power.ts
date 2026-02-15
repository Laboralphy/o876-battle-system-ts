import z from 'zod';
import { CONSTS } from '../consts';
import { AbilitySchema } from '../schemas/enums/Ability';

/**
 * This Effect modifies the spell power : The caster level of a spell cast with the specified ability score
 * is increased by the specified amount
 */
export const EffectSpellPower = z
    .strictObject({
        type: z.literal(CONSTS.EFFECT_SPELL_POWER).describe('fields.EffectType'),
        amp: z.number().int().describe('fields.amp'),
        ability: AbilitySchema,
    })
    .describe('Effect.abilityModifer');
