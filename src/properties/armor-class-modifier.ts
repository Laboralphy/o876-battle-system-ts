import z from 'zod';
import CONSTS from '../consts';
import { AbilitySchema } from '../schemas/enums/Ability';
import { DamageTypeSchema } from '../schemas/enums/DamageType';
import { AttackTypeSchema } from '../schemas/enums/AttackType';
import { SpecieSchema } from '../schemas/enums/Specie';

/**
 * Armor class modifier
 */
export const ArmorClassModifier = z.object({
    type: z.literal(CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER).describe('fields.propertyType'),
    attackType: AttackTypeSchema.optional(),
    damageType: DamageTypeSchema.optional(),
    specieType: SpecieSchema.optional(),
});
