import { CONSTS } from '../consts';
import z from 'zod';
import { DiceExpression } from '../schemas/DiceExpression';
import { DamageTypeSchema } from '../schemas/enums/DamageType';

export const EffectRegenerationSchema = z.object({
    type: z.literal(CONSTS.EFFECT_REGENERATION),
    amp: DiceExpression.or(z.number().int().positive()),
    vulnerabilities: z.array(DamageTypeSchema).optional().describe('fields.regenVulnerabilities'),
    useConstitutionModifier: z
        .boolean()
        .optional()
        .default(false)
        .describe('fields.useConstitutionModifier'),
    shutdown: z.number().int().optional().describe('fields.regenShutdown'),
    threshold: z.number().int().optional().describe('fields.regenThreshold'),
});
