import z from 'zod';
import { AmmoBlueprintSchema } from './AmmoBlueprint';
import { WeaponBlueprintSchema } from './WeaponBlueprint';
import { ArmorBlueprintSchema } from './ArmorBlueprint';
import { ShieldBlueprintSchema } from './ShieldBlueprint';
import { GearBlueprintSchema } from './GearBlueprint';
import { PropertySchema } from '../properties';

export const ItemBlueprintSchema = z.discriminatedUnion('itemType', [
    AmmoBlueprintSchema,
    WeaponBlueprintSchema,
    ArmorBlueprintSchema,
    ShieldBlueprintSchema,
    GearBlueprintSchema,
]);

export const ItemSchema = ItemBlueprintSchema.and(
    z.object({
        id: z.string(),
        temporaryProperties: z.array(
            // this is a temporary property
            z.object({
                id: z.string(),
                property: PropertySchema,
                duration: z.number().int(),
                tag: z.string(),
            })
        ),
    })
);

export type ItemBlueprint = z.infer<typeof ItemBlueprintSchema>;
export type Item = z.infer<typeof ItemSchema>;
