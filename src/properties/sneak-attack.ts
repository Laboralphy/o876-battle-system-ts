import z from 'zod';
import { CONSTS } from '../consts';

/**
 * Grants the creature the ability to perform sneak attacks.
 * Sneak attacks are extra damage dealt when attacking from hidden position.
 */
export const PropertyDefinitionSneakAttack = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_SNEAK_ATTACK),
});
