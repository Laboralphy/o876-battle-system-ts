import z from 'zod';
import { CONSTS } from '../consts';
import { EquipmentSlotSchema } from './enums/EquipmentSlot';
import { ProficiencySchema } from './enums/Proficiency';

export const ShieldBlueprintSchema = z.strictObject({
    itemType: z.literal(CONSTS.ITEM_TYPE_SHIELD).describe('fields.itemType'),
    armorClass: z.number().int().describe('fields.ac'),
    proficiency: ProficiencySchema,
    equipmentSlots: z.array(EquipmentSlotSchema),
});

export type ShieldBlueprint = z.infer<typeof ShieldBlueprintSchema>;
