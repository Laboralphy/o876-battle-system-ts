import z from 'zod';
import { CONSTS } from '../consts';
import { AmpExpression } from '../schemas/AmpExpression';
import { AbilitySchema } from '../schemas/enums/Ability';
import { ThreatTypeSchema } from '../schemas/enums/ThreatType';
import { SavingThrowSchema } from '../schemas/SavingThrow';

export const PropertySavingThrowModifier = z
    .strictObject({
        type: z.literal(CONSTS.PROPERTY_SAVING_THROW_MODIFIER).describe('fields.propertyType'),
        amp: AmpExpression.describe('fields.amp'),
    })
    .and(SavingThrowSchema);
