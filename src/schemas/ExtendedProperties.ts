import z from 'zod';
import { PropertyDefinitionSchema } from '../properties';
import { CONSTS } from '../consts';

export const ExtendedPropertiesSchema = z.object({
    entityType: z
        .literal(CONSTS.ENTITY_TYPE_EXTENDED_PROPERTIES)
        .describe('fields.CreatureField.entityType'),
    extends: z.array(z.string()).optional(),
    properties: z.array(PropertyDefinitionSchema),
});

export type ExtendedProperties = z.infer<typeof ExtendedPropertiesSchema>;
