import z from 'zod';
import { PropertySchema } from '../properties';
import { CONSTS } from '../consts';
import { ItemBlueprintSchema } from './Item';
import { ProficiencySchema } from './enums/Proficiency';

export const PartialCreatureBlueprintSchema = z.object({
    entityType: z
        .literal(CONSTS.ENTITY_TYPE_PARTIAL_CREATURE)
        .describe('fields.CreatureField.entityType'),
    extends: z.array(z.string()).optional(),
    properties: z.array(PropertySchema).optional(),
    feats: z.array(z.string()).optional(),
    equipment: z
        .array(z.union([z.string(), ItemBlueprintSchema]))
        .optional()
        .describe('fields.CreatureField.equipment'),
    proficiencies: z.array(ProficiencySchema).optional(),
});

export type PartialCreatureBlueprint = z.infer<typeof PartialCreatureBlueprintSchema>;
