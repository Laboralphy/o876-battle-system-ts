import z from 'zod';
import { CONSTS } from '../consts';
import { PropertyTypeSchema } from './enums/PropertyType';

export const ItemCommonPropertiesSchema = z.strictObject({
    ref: z.string().optional(),
    entityType: z.literal(CONSTS.ENTITY_TYPE_ITEM).describe('fields.entityType'),
    properties: z.array(PropertyTypeSchema),
    weight: z.number().min(0).describe('fields.weight'),
    charges: z.number().int().min(0).optional().describe('fields.charges'),
    tag: z.string().optional().describe('fields.tag'),
    spell: z.string().optional().describe('fields.spell'),
});
