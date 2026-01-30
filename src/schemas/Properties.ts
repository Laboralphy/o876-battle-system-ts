import z from 'zod';
import { PropertySchema } from './enums/Property';

// This schema validates an array of creature or item properties
export const PropertiesSchema = z.array(PropertySchema).describe('fields.itemProperties');

export type Properties = z.infer<typeof PropertiesSchema>;
