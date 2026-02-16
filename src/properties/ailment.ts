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
    savingThrow: AbilitySchema.optional(),
    subType: EffectSubtypeSchema.optional().default(CONSTS.EFFECT_SUBTYPE_MAGICAL),
    duration: z.number().int().optional(),
    ability: AbilitySchema.optional(),
    damageType: DamageTypeSchema.optional(),
    attackType: AttackTypeSchema.optional(),
    disease: DiseaseSchema.optional(),
});
