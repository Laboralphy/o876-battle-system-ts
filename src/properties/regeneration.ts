import z from 'zod';
import { CONSTS } from '../consts';
import { DiceExpression } from '../schemas/DiceExpression';
import { DamageTypeSchema } from '../schemas/enums/DamageType';

/**
 * Represents the schema definition for the `PropertyRegeneration` object.
 *
 * This schema validates the structure of an object used to define properties related to regeneration behavior.
 * This property applied to a creature or an item equipped by this creature, grants this creature the ability to regenerate health points.
 *
 * Fields:
 * - `type`: A literal constant indicating the property type for regeneration. Must match the `CONSTS.PROPERTY_REGENERATION` constant.
 * - `amp`: Specifies the amplification value for regeneration. Can be either a dice expression or an integer.
 * - `vulnerabilities`: An optional array of damage types that the regeneration is vulnerable to. When struct by this damage type the regeneration stops and the damage
 * is added to the shutdown accumulator
 * - `useConstitutionModifier`: An optional boolean specifying whether or not to use the constitution modifier. Defaults to `false`.
 * - `shutdown`: An optional integer representing a shutdown value related to regeneration. When this value is greter thant zero, the regenration
 * is canceled until the value soaks up all the damage dealt.
 * - `threshold`: An optional integer defining the threshold value for regeneration. When Hitpoints are below this value, the regeneration is triggered.
 * When the HP is above the threshold, the regeneration is canceled.
 */
export const PropertyRegeneration = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_REGENERATION).describe('fields.propertyType'),
    amp: DiceExpression.or(z.number().int()).describe('fields.amp'),
    vulnerabilities: z.array(DamageTypeSchema).optional().describe('fields.regenVulnerabilities'),
    useConstitutionModifier: z
        .boolean()
        .optional()
        .default(false)
        .describe('fields.useConstitutionModifier'),
    shutdown: z.number().int().optional().describe('fields.regenShutdown'),
    threshold: z.number().int().optional().describe('fields.regenThreshold'),
});
