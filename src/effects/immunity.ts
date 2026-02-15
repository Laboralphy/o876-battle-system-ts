import z from 'zod';
import { CONSTS } from '../consts';
import { ImmunitySchema } from '../schemas/enums/Immunity';

/**
 * This Effect makes the creature immune to a certain type of conditions or ailments.
 * see IMMUNITY_TYPES constants
 */
export const EffectImmunity = z.strictObject({
    type: z.literal(CONSTS.EFFECT_IMMUNITY),
    immunityType: ImmunitySchema,
});
