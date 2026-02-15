import z from 'zod';
import { CONSTS } from '../consts';
import { AmpExpression } from '../schemas/AmpExpression';

/**
 * This property modifies to output damage of a certain type
 * The amp may be a dice expression
 */
export const PropertyWeaponDamageModifier = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_WEAPON_DAMAGE_MODIFIER),
    amp: AmpExpression,
});
