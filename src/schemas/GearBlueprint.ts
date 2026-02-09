import z from 'zod';
import { CONSTS } from '../consts';
import { EquipmentSlotSchema } from './enums/EquipmentSlot';

export const GearBlueprintSchema = z.strictObject({
    itemType: z
        .union([
            z.literal(CONSTS.ITEM_TYPE_BELT),
            z.literal(CONSTS.ITEM_TYPE_BOOTS),
            z.literal(CONSTS.ITEM_TYPE_GLOVES),
            z.literal(CONSTS.ITEM_TYPE_HELM),
            z.literal(CONSTS.ITEM_TYPE_BRACERS),
            z.literal(CONSTS.ITEM_TYPE_CLOAK),
            z.literal(CONSTS.ITEM_TYPE_GAUNTLETS),
            z.literal(CONSTS.ITEM_TYPE_HAT),
            z.literal(CONSTS.ITEM_TYPE_RING),
            z.literal(CONSTS.ITEM_TYPE_NECKLACE),
            z.literal(CONSTS.ITEM_TYPE_TORCH),
        ])
        .describe('fields.itemType'),
    equipmentSlots: z.array(EquipmentSlotSchema),
});

export type GearBlueprint = z.infer<typeof GearBlueprintSchema>;
