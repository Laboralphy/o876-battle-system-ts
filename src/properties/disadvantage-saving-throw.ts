import z from 'zod';
import { CONSTS } from '../consts';
import { SavingThrowSchema } from '../schemas/SavingThrow';

/**
 * Schema for disadvantage on saving throws.
 */
export const PropertyDisadvantageSavingThrow = z
    .strictObject({
        type: z.literal(CONSTS.PROPERTY_DISADVANTAGE_SAVING_THROW).describe('fields.propertyType'),
    })
    .and(SavingThrowSchema);
