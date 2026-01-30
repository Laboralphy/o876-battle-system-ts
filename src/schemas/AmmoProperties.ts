import z from 'zod';
import { CONSTS } from '../consts';
import * as AMMO_TYPES from '../consts/ammo-types.json';
import { EquipmentSlotSchema } from './enums/EquipmentSlot';

export const AmmoPropertiesSchema = z.strictObject({
    itemType: z.literal(CONSTS.ITEM_TYPE_AMMO).describe('fields.itemType'),
    ammoType: z.enum(Object.values(AMMO_TYPES)).describe('fields.ammoType'),
    equipmentSlots: z.array(EquipmentSlotSchema),
});

export type AmmoProperties = z.infer<typeof AmmoPropertiesSchema>;
