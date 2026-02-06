import z from 'zod';
import { CONSTS } from '../consts';

export const PartialBlueprintSchema = z.object({
    entityType: z.literal(CONSTS.ENTITY_TYPE_PARTIAL).describe('fields.CreatureField.entityType'),
    extends: z.array(z.string()).optional(),
});

export type PartialBlueprint = z.infer<typeof PartialBlueprintSchema>;
