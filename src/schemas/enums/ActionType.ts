import z from 'zod';
import { CONSTS } from '../../consts';

export const ActionTypeSchema = z
    .enum([
        CONSTS.ACTION_TYPE_ATTACK,
        CONSTS.ACTION_TYPE_SPELL,
        CONSTS.ACTION_TYPE_SPELL_LIKE_ABILITY,
    ])
    .describe('fields.actionType');

export type ActionType = z.infer<typeof ActionTypeSchema>;
