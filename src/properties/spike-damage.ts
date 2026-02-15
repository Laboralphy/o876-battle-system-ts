import z from 'zod';
import { CONSTS } from '../consts';
import { AmpExpression } from '../schemas/AmpExpression';
import { DamageTypeSchema } from '../schemas/enums/DamageType';
import { AbilitySchema } from '../schemas/enums/Ability';
import { ThreatTypeSchema } from '../schemas/enums/ThreatType';

/**
 * This property modifies the spike damage of an armor or shield.
 * spike damage is an automatic retaliation damage dealt when a target is struct with an attack :
 * If amp is a number 0-1, a portion of incoming damage is sent back to the attacker
 * If amp is a Dice expression, the amount of damage is rolled and applied to the attacker
 *
 */
export const PropertySpikeDamage = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_SPIKE_DAMAGE),
    amp: AmpExpression,
    damageType: DamageTypeSchema.optional(),
    savingThrow: AbilitySchema.optional(),
    threat: ThreatTypeSchema.optional(),
    maxDistance: z.number().int().optional().default(Infinity),
});
