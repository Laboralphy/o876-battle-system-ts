import z from 'zod';
import { AmmoPropertiesSchema } from './ammo-properties';
import CONSTS from '../consts';
import { PropertiesSchema } from './properties';

export const ItemSchema = z
    .strictObject({
        ref: z.string().optional(),
        entityType: z.literal(CONSTS.ENTITY_TYPE_ITEM).describe('fields.entityType'),
        properties: PropertiesSchema,
        weight: z.number().min(0).describe('fields.weight'),
        charges: z.number().int().min(0).optional().describe('fields.charges'),
        tag: z.string().optional().describe('fields.tag'),
        spell: z.string().optional().describe('fields.spell'),
    })
    .and(z.discriminatedUnion('itemType', [AmmoPropertiesSchema]));

export type Item = z.infer<typeof ItemSchema>;
