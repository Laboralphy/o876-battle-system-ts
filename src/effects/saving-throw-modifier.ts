import z from 'zod';
import { CONSTS } from '../consts';
import { AmpExpression } from '../schemas/AmpExpression';
import { AbilitySchema } from '../schemas/enums/Ability';
import { ThreatTypeSchema } from '../schemas/enums/ThreatType';

export const EffectSavingThrowModifier = z.strictObject({
    type: z.literal(CONSTS.EFFECT_SAVING_THROW_MODIFIER).describe('fields.EffectType'),
    amp: AmpExpression.describe('fields.amp'),
    ability: AbilitySchema,
    threat: ThreatTypeSchema.optional().default(CONSTS.THREAT_TYPE_ANY),
});
