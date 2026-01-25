import z from 'zod';
import { AmmoPropertiesSchema } from './ammo-properties';

const ItemSchema = z.discriminatedUnion('itemType', [AmmoPropertiesSchema]);
