import { CONSTS } from '../consts';
import z from 'zod';

export const PropertyNegativeLevel = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_NEGATIVE_LEVEL),
    amp: z.number().int().positive(),
});
