import z from 'zod';
import { CONSTS } from '../consts';
import { AttackTypeSchema } from '../schemas/enums/AttackType';
import { SpecieSchema } from '../schemas/enums/Specie';

export const EffectAdvantageAttack = z.strictObject({
    type: z.literal(CONSTS.EFFECT_ADVANTAGE_ATTACK).describe('fields.EffectType'),
    attackType: AttackTypeSchema.optional().default(CONSTS.ATTACK_TYPE_ANY),
    specie: SpecieSchema.optional().default(CONSTS.SPECIE_ANY),
});
