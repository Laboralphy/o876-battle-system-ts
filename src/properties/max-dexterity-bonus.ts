import z from 'zod';
import { CONSTS } from '../consts';

/**
 * This property usually applied to medium and heavy armors to indicate the max dexterity bonus allowed
 * An heavy armor has usually this property set with an amp of 0
 * Intermediate armor has usually this property set with an amp of 4
 * A light armor has usually this property set with an amp of 8 or more for uncommon flexible armors.
 */
export const PropertyDefinitionMaxDexterityBonus = z
    .strictObject({
        type: z.literal(CONSTS.PROPERTY_MAX_DEXTERITY_BONUS).describe('fields.propertyType'),
        amp: z.number().int().describe('fields.amp'),
    })
    .describe('property.maxDexterityBonus');
