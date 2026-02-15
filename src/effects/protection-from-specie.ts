import z from 'zod';
import { CONSTS } from '../consts';
import { SpecieSchema } from '../schemas/enums/Specie';

export const EffectProtectionFromSpecie = z.strictObject({
    type: z.literal(CONSTS.EFFECT_PROTECTION_FROM_SPECIE),
    specie: SpecieSchema,
    attack: z.boolean(),
});
