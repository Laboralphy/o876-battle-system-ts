import z from 'zod';
import CONSTS from '../consts';

const ItemCommonPropertiesSchema = z.object({
    ref: z.string().optional(),
    entityType: z.literal(CONSTS.ENTITY_TYPE_ITEM).describe('fields.entityType'),
    // properties: z.array(Property).describe('fields.itemProperties'),
    weight: z.number().min(0).describe('fields.weight'),
    charges: z.number().int().min(0).optional().describe('fields.charges'),
    tag: z.string().optional().describe('fields.tag'),
    spell: z.string().optional().describe('fields.spell'),
});
