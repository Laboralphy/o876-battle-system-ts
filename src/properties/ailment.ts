import z from 'zod';
import { CONSTS } from '../consts';
import { AilmentSchema } from '../schemas/enums/Ailment';
import { AbilitySchema } from '../schemas/enums/Ability';
import { EffectSubtypeSchema } from '../schemas/enums/EffectSubtype';
import { DamageTypeSchema } from '../schemas/enums/DamageType';
import { AttackTypeSchema } from '../schemas/enums/AttackType';
import { DiseaseSchema } from '../schemas/enums/Disease';
import { AmpExpression } from '../schemas/AmpExpression';

export const PropertyAilment = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_AILMENT).describe('fields.propertyType'),
    amp: AmpExpression.optional().default(0),
    ailment: AilmentSchema,
    savingThrow: AbilitySchema.optional().default(CONSTS.ABILITY_STRENGTH),
    subType: EffectSubtypeSchema.optional().default(CONSTS.EFFECT_SUBTYPE_MAGICAL),
    duration: z.number().int().optional().default(0),
    ability: AbilitySchema.optional().default(CONSTS.ABILITY_STRENGTH),
    damageType: DamageTypeSchema.optional().default(CONSTS.DAMAGE_TYPE_ANY),
    attackType: AttackTypeSchema.optional().default(CONSTS.ATTACK_TYPE_ANY),
    disease: DiseaseSchema.optional().default(CONSTS.DISEASE_GHOUL_FEVER),
});
