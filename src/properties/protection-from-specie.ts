import z from 'zod';
import { CONSTS } from '../consts';
import { SpecieSchema } from '../schemas/enums/Specie';

/**
 * This property will protect the creature from attacks from creature of a certain specie
 */
export const PropertyDefinitionProtectionFromSpecie = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_PROTECTION_FROM_SPECIE),
    specie: SpecieSchema,
    attack: z.boolean(),
});
