import z from 'zod';
import { CONSTS } from '../../consts';

export const EntityTypeSchema = z
    .enum([
        CONSTS.ENTITY_TYPE_ACTOR,
        CONSTS.ENTITY_TYPE_ITEM,
        CONSTS.ENTITY_TYPE_PARTIAL_ACTOR,
        CONSTS.ENTITY_TYPE_PARTIAL_ITEM,
    ])
    .describe('fields.entityType');

export type EntityType = z.infer<typeof EntityTypeSchema>;
