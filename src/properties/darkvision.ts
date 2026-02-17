import z from 'zod';
import { CONSTS } from '../consts';

/**
 * Makes the creature able to see in dark environments
 */
export const PropertyDefinitionDarkvision = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_DARKVISION),
});
