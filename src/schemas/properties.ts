import z from 'zod';
import { AmmoPropertiesSchema } from './ammo-properties';

// This schema validates any creature of item property
export const PropertySchema = z.discriminatedUnion('type', [AmmoPropertiesSchema]);

// This schema validates an array of creature or item properties
export const PropertiesSchema = z.array(PropertySchema).describe('fields.itemProperties');

export type Property = z.infer<typeof PropertySchema>;
export type Properties = z.infer<typeof PropertiesSchema>;
