import z from 'zod';
import { CONSTS } from '../consts';
import { AbilitySchema } from '../schemas/enums/Ability';
import { ThreatTypeSchema } from '../schemas/enums/ThreatType';
import { DamageTypeSchema } from '../schemas/enums/DamageType';

export const EffectBreaker = z.strictObject({
    type: CONSTS.EFFECT_BREAKER,
    attack: z.boolean().optional().default(false),
    // saving throw
    // when creature success in saving throw, it breaks the effect
    ability: AbilitySchema.optional(),
    threat: ThreatTypeSchema.optional(),
    dc: z.number().int().positive().optional().default(0),
    // When creature receive this amoount of cumulated damage : it breaks the effect
    damage: z.number().int().optional().default(Infinity),
    damageType: DamageTypeSchema.optional(),
});
