import z from 'zod';

export const SpellSlotSchema = z.object({
    level: z.number().int().min(0).max(9),
    cooldown: z.number().int().min(0),
    cooldownTimer: z.number().int().min(0),
    count: z.number().int().min(0),
});
