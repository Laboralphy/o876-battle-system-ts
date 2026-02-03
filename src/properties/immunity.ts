import z from 'zod';
import { CONSTS } from '../consts';
import { ImmunitySchema } from '../schemas/enums/Immunity';

/**
 * This property makes the creature immune to a certain type of conditions or ailments.
 * see IMMUNITY_TYPES constants
 */
export const PropertyImmunity = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_IMMUNITY),
    damageType: ImmunitySchema,
});
