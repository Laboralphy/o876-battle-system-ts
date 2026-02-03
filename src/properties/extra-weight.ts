import z from 'zod';
import { CONSTS } from '../consts';

/**
 * The base weight of the item is multiplied by a certain factor. This is usually a number below 1
 * to reduce an item weight.
 */
export const PropertyWeightFactor = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_WEIGHT_FACTOR).describe('fields.propertyType'),
    amp: z.number().describe('fields.amp'),
});
