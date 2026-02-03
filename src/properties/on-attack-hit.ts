import z from 'zod';
import { CONSTS } from '../consts';
import { OnAttackHitSchema } from '../schemas/enums/OnAttackHit';
import { AbilitySchema } from '../schemas/enums/Ability';
import { ThreatTypeSchema } from '../schemas/enums/ThreatType';
import { EffectSubtypeSchema } from '../schemas/enums/EffectSubtype';
import { DamageTypeSchema } from '../schemas/enums/DamageType';
import { AttackTypeSchema } from '../schemas/enums/AttackType';
import { DiseaseSchema } from '../schemas/enums/Disease';

export const PropertyOnAttackHit = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_ON_ATTACK_HIT).describe('fields.propertyType'),
    ailment: OnAttackHitSchema,
    savingThrow: AbilitySchema.or(ThreatTypeSchema),
    subType: EffectSubtypeSchema.optional().default(CONSTS.EFFECT_SUBTYPE_MAGICAL),
    duration: z.number().int().optional(),
    ability: AbilitySchema.optional(),
    damageType: DamageTypeSchema.optional(),
    attackType: AttackTypeSchema.optional(),
    disease: DiseaseSchema.optional(),
});
