import z from 'zod';
import { AmmoBlueprintSchema } from './AmmoBlueprint';
import { WeaponBlueprintSchema } from './WeaponBlueprint';
import { ArmorBlueprintSchema } from './ArmorBlueprint';
import { ShieldBlueprintSchema } from './ShieldBlueprint';
import { GearBlueprintSchema } from './GearBlueprint';
import { PropertySchema } from '../properties';
import { TemporaryPropertySchema } from './TemporaryProperty';

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
        temporaryProperties: z.array(TemporaryPropertySchema),
    })
);

export type ItemBlueprint = z.infer<typeof ItemBlueprintSchema>;
export type Item = z.infer<typeof ItemSchema>;
