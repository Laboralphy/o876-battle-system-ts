import z from 'zod';
import { CONSTS } from '../consts';
import { EquipmentSlotSchema } from './enums/EquipmentSlot';
import { AmmoTypeSchema } from './enums/AmmoType';

export const AmmoBlueprintSchema = z.strictObject({
    itemType: z.literal(CONSTS.ITEM_TYPE_AMMO).describe('fields.itemType'),
    ammoType: AmmoTypeSchema.describe('fields.ammoType'),
    equipmentSlots: z.array(EquipmentSlotSchema),
});

export type AmmoBlueprint = z.infer<typeof AmmoBlueprintSchema>;
