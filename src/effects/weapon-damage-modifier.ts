import z from 'zod';
import { CONSTS } from '../consts';
import { DiceExpression } from '../schemas/DiceExpression';

/**
 * This property modifies to output damage of a certain type
 * The amp may be a dice expression
 */
export const EffectWeaponDamageModifier = z.strictObject({
    type: z.literal(CONSTS.EFFECT_WEAPON_DAMAGE_MODIFIER),
    amp: DiceExpression.or(z.number().int()),
});
