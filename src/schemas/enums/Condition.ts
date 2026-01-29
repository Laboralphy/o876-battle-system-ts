import z from 'zod';
import { CONSTS } from '../../consts';

export const ConditionSchema = z
    .enum([
        CONSTS.CONDITION_BLINDED,
        CONSTS.CONDITION_CHARMED,
        CONSTS.CONDITION_FRIGHTENED,
        CONSTS.CONDITION_INCAPACITATED,
        CONSTS.CONDITION_PARALYZED,
        CONSTS.CONDITION_PETRIFIED,
        CONSTS.CONDITION_POISONED,
        CONSTS.CONDITION_RESTRAINED,
        CONSTS.CONDITION_STUNNED,
    ])
    .describe('fields.condition');

export type Condition = z.infer<typeof ConditionSchema>;
