import z from 'zod';
import { CONSTS } from '../consts';
import { AbilitySchema } from '../schemas/enums/Ability';
import { ThreatTypeSchema } from '../schemas/enums/ThreatType';

/**
 * Schema for disadvantage on saving throws.
 */
export const EffectDisadvantageSavingThrow = z.strictObject({
    type: z.literal(CONSTS.EFFECT_DISADVANTAGE_SAVING_THROW).describe('fields.EffectType'),
    ability: AbilitySchema,
    threat: ThreatTypeSchema.optional().default(CONSTS.THREAT_TYPE_ANY),
});
