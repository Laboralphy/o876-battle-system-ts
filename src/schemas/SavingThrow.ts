import z from 'zod';
import { AbilitySchema } from './enums/Ability';
import { ThreatTypeSchema } from './enums/ThreatType';
import { CONSTS } from '../consts';

export const SavingThrowSchema = z.strictObject({
    ability: AbilitySchema,
    threat: ThreatTypeSchema.optional().default(CONSTS.THREAT_TYPE_ANY),
});
