import z from 'zod';

/**
 * This schema define the base structure of a property in order to manage temporary properties
 * applied on items.
 */
export const BasePropertySchema = z.object({
    id: z.string(),
    duration: z.number().int().positive(),
    temporary: z.boolean(),
    tag: z.string(),
});

export type BaseProperty = z.infer<typeof BasePropertySchema>;
