import z from 'zod';
import { ActionTypeSchema } from './enums/ActionType';

export const ActionDefinitionSchema = z.strictObject({
    id: z.string().describe('fields.ActionField.id'),
    actionType: ActionTypeSchema,
    bonus: z.boolean().describe('fields.ActionField.bonus'),
    hostile: z.boolean().describe('fields.ActionField.hostile'),
    script: z.string().describe('fields.ActionField.script'),
    parameters: z.object().optional().describe('fields.ActionField.parameters'),
    range: z.number().int().min(0).describe('fields.ActionField.range'),
    cooldown: z.number().int().min(0).optional().default(0).describe('fields.ActionField.cooldown'),
    charges: z.number().int().min(0).optional().default(0).describe('fields.ActionField.charges'),
    delay: z.number().int().min(0).optional().default(0).describe('fields.ActionField.delay'),
});

export const ActionSchema = z.strictObject({
    blueprint: ActionDefinitionSchema,
    hasLimitedCharges: z.boolean(),
    hasCooldown: z.boolean(),
    cooldownTimer: z.array(z.number().int()),
});

export type Action = z.infer<typeof ActionSchema>;
