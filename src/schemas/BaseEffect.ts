import z from 'zod';
import { EffectSubtypeSchema } from './enums/EffectSubtype';
import { EffectTypeSchema } from './enums/EffectType';

/**
 * This schema define the base structure of an effect in order to manager these effects
 * properly by updating duration, keeping reference to target ans source creature
 * and knowing all effect sibling (when an effect is dispelled, all its siblings are dispelled)
 */
export const BaseEffectSchema = z.object({
    id: z.string(),
    type: EffectTypeSchema,
    subtype: EffectSubtypeSchema,
    duration: z.number().int().min(0),
    target: z.string(),
    source: z.string(),
    siblings: z.array(z.string()),
    tag: z.string(),
});
