import z from 'zod';
import { CONSTS } from '../consts';
import { AbilitySchema } from '../schemas/enums/Ability';
import { ThreatTypeSchema } from '../schemas/enums/ThreatType';
import { DamageTypeSchema } from '../schemas/enums/DamageType';

export const EffectBreaker = z.strictObject({
    type: z.literal(CONSTS.EFFECT_BREAKER),
    // if true the effect and its siblings will expire if creature attacks
    attack: z.boolean().optional().default(false),
    // saving throw
    // when creature success in saving throw, it breaks the effects
    ability: AbilitySchema.optional(),
    threat: ThreatTypeSchema.optional(),
    dc: z.number().int().positive().optional().default(0),
    // When creature receive this amount of cumulated damage : it breaks the effect
    damage: z.number().int().optional().default(Infinity),
    damageType: DamageTypeSchema.optional(),
});
