import z from 'zod';
import { CONSTS } from '../consts';
import { DiceExpression } from '../schemas/DiceExpression';
import { AbilitySchema } from '../schemas/enums/Ability';
import { ThreatTypeSchema } from '../schemas/enums/ThreatType';

export const EffectSavingThrowModifier = z.strictObject({
    type: z.literal(CONSTS.EFFECT_SAVING_THROW_MODIFIER).describe('fields.propertyType'),
    amp: DiceExpression.or(z.number().int()).describe('fields.amp'),
    ability: AbilitySchema,
    threat: ThreatTypeSchema.optional(),
});
