import z from 'zod';
import { CONSTS } from '../consts';
import { AbilitySchema } from '../schemas/enums/Ability';
import { ThreatTypeSchema } from '../schemas/enums/ThreatType';
import { DamageTypeSchema } from '../schemas/enums/DamageType';
import { IEffectProgram } from '../IEffectProgram';
import { Creature } from '../Creature';
import { Effect } from './index';

export const EffectBreaker = z.strictObject({
    type: z.literal(CONSTS.EFFECT_BREAKER),
    // if true the effect and its siblings will expire if creature attacks
    attack: z.boolean().optional().default(false),
    // saving throw
    // when creature success in saving throw, it breaks the effects
    ability: AbilitySchema.optional().default(CONSTS.ABILITY_STRENGTH), // ignored if dc is 0
    threat: ThreatTypeSchema.optional().default(CONSTS.THREAT_TYPE_ANY),
    dc: z.number().int().positive().optional().default(0), // if zero then no saving throw required, ability is ignored
    // When creature receive this amount of cumulated damage : it breaks the effect
    damage: z.number().int().optional().default(Infinity),
    damageType: DamageTypeSchema.optional().default(CONSTS.DAMAGE_TYPE_ANY),
});

export class EffectBreakerProgram implements IEffectProgram {
    /**
     * If the effect is breakable by damage, roll saving throw
     * @param effect - effect to break
     * @param target - creature whose effect is applied on
     * @param source - creature who applied the effect
     */
    mutate(effect: Effect, target: Creature, source: Creature) {
        if (effect.type === CONSTS.EFFECT_BREAKER) {
            const dc = 'dc' in effect ? effect.dc : 0;
            if (dc > 0) {
                //
            }
        }
    }
}
