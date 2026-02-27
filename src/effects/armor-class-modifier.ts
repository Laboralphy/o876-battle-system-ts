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
 *
 *
 */
export const EffectArmorClassModifier = z.strictObject({
    type: z.literal(CONSTS.EFFECT_ARMOR_CLASS_MODIFIER).describe('fields.EffectType'),
    amp: z.number().int().describe('fields.amp'),
    attackType: AttackTypeSchema.optional().default(CONSTS.ATTACK_TYPE_ANY),
    damageType: DamageTypeSchema.optional().default(CONSTS.DAMAGE_TYPE_ANY),
    specie: SpecieSchema.optional().default(CONSTS.SPECIE_ANY),
});
