import z from 'zod';
import { CONSTS } from '../consts';
import { PropertySchema } from '../properties';

export const ItemCommonBlueprintSchema = z.strictObject({
    entityType: z.literal(CONSTS.ENTITY_TYPE_ITEM).describe('fields.entityType'),
    properties: z.array(PropertySchema),
    weight: z.number().min(0).describe('fields.weight'),
    charges: z.number().int().min(0).optional().describe('fields.charges'),
    tag: z.string().optional().describe('fields.tag'),
    spell: z.string().optional().describe('fields.spell'),
});
