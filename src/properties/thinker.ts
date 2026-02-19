import z from 'zod';
import { CONSTS } from '../consts';

export const PropertyThinker = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_THINKER),
    combat: z.string().optional(),
    damage: z.string().optional(),
    damaged: z.string().optional(),
    attacked: z.string().optional(),
});
