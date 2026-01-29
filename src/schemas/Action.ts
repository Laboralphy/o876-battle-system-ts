import z from 'zod';
import { ActionTypeSchema } from './enums/ActionType';

export const ActionSchema = z.strictObject({
    id: z.string().describe('fields.ActionField.id'),
    actionType: ActionTypeSchema,
    bonus: z.boolean().describe('fields.ActionField.bonus'),
    hostile: z.boolean().describe('fields.ActionField.hostile'),
    script: z.string().describe('fields.ActionField.script'),
    parameters: z.object().optional().describe('fields.ActionField.parameters'),
    cooldown: z.number().int().min(0).optional().describe('fields.ActionField.cooldown'),
    charges: z.number().int().min(0).optional().describe('fields.ActionField.charges'),
    range: z.number().int().min(0).describe('fields.ActionField.range'),
    delay: z.number().int().min(0).optional().describe('fields.ActionField.delay'),
});
