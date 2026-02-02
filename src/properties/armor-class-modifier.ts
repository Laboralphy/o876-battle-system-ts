import z from 'zod';
import { CONSTS } from '../consts';
import { DamageTypeSchema } from '../schemas/enums/DamageType';
import { AttackTypeSchema } from '../schemas/enums/AttackType';
import { SpecieSchema } from '../schemas/enums/Specie';

/**
 * Armor class modifier
 * The AC modifier can be limited to a certain type of attack (melee, ranged)
 * a certain type of damage (usually physical, but modern of futuristic weapon can use force damage, or electric damage),
 * and a certain type of species
 */
export const PropertyArmorClassModifier = z.object({
    type: z.literal(CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER).describe('fields.propertyType'),
    attackType: AttackTypeSchema.optional(),
    damageType: DamageTypeSchema.optional(),
    specieType: SpecieSchema.optional(),
});
