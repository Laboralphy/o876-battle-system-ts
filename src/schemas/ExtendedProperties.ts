import z from 'zod';
import { PropertySchema } from '../properties';
import { CONSTS } from '../consts';

export const ExtendedPropertiesSchema = z.object({
    entityType: z
        .union([
            z.literal(CONSTS.ENTITY_TYPE_PARTIAL_CREATURE),
            z.literal(CONSTS.ENTITY_TYPE_PARTIAL_ITEM),
        ])
        .describe('fields.CreatureField.entityType'),
    extends: z.array(z.string()).optional(),
    properties: z.array(PropertySchema).optional(),
});

export type ExtendedProperties = z.infer<typeof ExtendedPropertiesSchema>;
