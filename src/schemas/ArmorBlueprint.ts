import z from 'zod';
import { CONSTS } from '../consts';
import { EquipmentSlotSchema } from './enums/EquipmentSlot';
import { ProficiencySchema } from './enums/Proficiency';

export const ArmorBlueprintSchema = z.strictObject({
    itemType: z.literal(CONSTS.ITEM_TYPE_ARMOR).describe('fields.itemType'),
    ac: z.number().int().describe('fields.ac'),
    proficiency: ProficiencySchema,
    equipmentSlots: z.array(EquipmentSlotSchema),
});

export type ArmorBlueprint = z.infer<typeof ArmorBlueprintSchema>;
