import z from 'zod';
import { CONSTS } from '../consts';
import { FeatTypeSchema } from '../schemas/enums/FeatType';

export const PropertyFeat = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_FEAT).describe('fields.propertyType'),
    feat: FeatTypeSchema,
});
