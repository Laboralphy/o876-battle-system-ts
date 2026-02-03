import z from 'zod';
import { CONSTS } from '../consts';
import { DiceExpression } from '../schemas/DiceExpression';
import { AbilitySchema } from '../schemas/enums/Ability';
import { ThreatTypeSchema } from '../schemas/enums/ThreatType';

export const PropertySavingThrowModifier = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_SAVING_THROW_MODIFIER).describe('fields.propertyType'),
    amp: DiceExpression.or(z.number().int()).describe('fields.amp'),
    ability: AbilitySchema.or(z.number().int()),
    threat: ThreatTypeSchema.optional(),
    universal: z.boolean().optional().default(false),
});
