import z from 'zod';
import { CONSTS } from '../consts';

/**
 * The maximum hitpoints is increased to a fixed amount.
 */
export const PropertyDefinitionExtraHitpoints = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_EXTRA_HITPOINTS).describe('fields.propertyType'),
    amp: z.number().int().describe('fields.amp'),
});
