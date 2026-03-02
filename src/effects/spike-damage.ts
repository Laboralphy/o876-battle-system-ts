import z from 'zod';
import { CONSTS } from '../consts';
import { AmpExpression } from '../schemas/AmpExpression';
import { DamageTypeSchema } from '../schemas/enums/DamageType';
import { SavingThrowSchema } from '../schemas/SavingThrow';

/**
 * This Effect modifies the spike damage of an armor or shield.
 * spike damage is an automatic retaliation damage dealt when a target is struct with an attack :
 * If amp is a number 0-1, a portion of incoming damage is sent back to the attacker
 * If amp is a Dice expression, the amount of damage is rolled and applied to the attacker
 *
 */
export const EffectSpikeDamage = z.strictObject({
    type: z.literal(CONSTS.EFFECT_SPIKE_DAMAGE),
    amp: AmpExpression,
    damageType: DamageTypeSchema.optional().default(CONSTS.DAMAGE_TYPE_ANY),
    savingThrow: SavingThrowSchema.optional(),
    maxDistance: z.number().int().optional().default(Infinity),
});
