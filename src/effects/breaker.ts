import z from 'zod';
import { CONSTS } from '../consts';
import { DamageTypeSchema } from '../schemas/enums/DamageType';
import { IEffectProgram } from '../IEffectProgram';
import { Creature } from '../Creature';
import { Effect } from './index';
import { SavingThrowSchema } from '../schemas/SavingThrow';
import { AbilitySchema } from '../schemas/enums/Ability';
import { ThreatTypeSchema } from '../schemas/enums/ThreatType';

export const EffectBreaker = z.strictObject({
    type: z.literal(CONSTS.EFFECT_BREAKER),
    // if true the effect and its siblings will expire if creature attacks
    attack: z.boolean().optional().default(false),
    // saving throw
    // when creature success in saving throw, it breaks the effects
    savingThrowAbility: AbilitySchema.optional(),
    savingThrowThreat: ThreatTypeSchema.optional(),
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
                // saving throw is required
            }
        }
    }
}
