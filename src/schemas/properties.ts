import z from 'zod';
import { AmmoPropertiesSchema } from './ammo-properties';

// This schema validates any creature of item property
const PropertySchema = z.discriminatedUnion('type', [AmmoPropertiesSchema]);

// This schema validates an array of creature or item properties
const PropertiesSchema = z.array(PropertySchema).describe('fields.itemProperties');
