import z from 'zod';
import { PropertyTypeSchema } from './enums/PropertyType';

// This schema validates an array of creature or item properties
export const PropertyTypesSchema = z.array(PropertyTypeSchema).describe('fields.itemProperties');

export type PropertyTypes = z.infer<typeof PropertyTypesSchema>;
