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
export const EffectAdvantageSavingThrow = z.strictObject({
    type: z.literal(CONSTS.EFFECT_ADVANTAGE_SAVING_THROW).describe('fields.EffectType'),
    ability: AbilitySchema,
    threat: ThreatTypeSchema.optional().default(CONSTS.THREAT_TYPE_ANY),
    specie: SpecieSchema.optional().default(CONSTS.SPECIE_ANY),
});
