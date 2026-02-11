import z from 'zod';
import { AmmoBlueprintSchema } from './AmmoBlueprint';
import { WeaponBlueprintSchema } from './WeaponBlueprint';
import { ArmorBlueprintSchema } from './ArmorBlueprint';
import { ShieldBlueprintSchema } from './ShieldBlueprint';
import { GearBlueprintSchema } from './GearBlueprint';

export const ItemBlueprintSchema = z.discriminatedUnion('itemType', [
    AmmoBlueprintSchema,
    WeaponBlueprintSchema,
    ArmorBlueprintSchema,
    ShieldBlueprintSchema,
    GearBlueprintSchema,
]);

export type ItemBlueprint = z.infer<typeof ItemBlueprintSchema>;

export const ItemSchema = z
    .object({
        id: z.string(),
        ref: z.string(),
    })
    .and(ItemBlueprintSchema);

export type Item = z.infer<typeof ItemSchema>;
