import z from 'zod';
import { CONSTS } from '../consts';
import { SkillSchema } from '../schemas/enums/Skill';

export const PropertyDefinitionSkillModifier = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_SKILL_MODIFIER).describe('fields.propertyType'),
    amp: z.number().int().describe('fields.amp'),
    skill: SkillSchema,
});
