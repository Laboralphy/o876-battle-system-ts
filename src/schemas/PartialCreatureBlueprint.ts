import z from 'zod';
import { PropertySchema } from '../properties';
import { CONSTS } from '../consts';
import { ProficiencySchema } from './enums/Proficiency';
import { ActionSchema } from './Action';

export const PartialCreatureBlueprintSchema = z.object({
    entityType: z
        .literal(CONSTS.ENTITY_TYPE_EXTENDED_PROPERTIES)
        .describe('fields.CreatureField.entityType'),
    extends: z.array(z.string()).optional(),
    properties: z.array(PropertySchema).optional(),
    feats: z.array(z.string()).optional(),
    proficiencies: z.array(ProficiencySchema).optional(),
    actions: z.array(ActionSchema).optional(),
});

export type PartialCreatureBlueprint = z.infer<typeof PartialCreatureBlueprintSchema>;
