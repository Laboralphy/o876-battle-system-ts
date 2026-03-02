import z from 'zod';
import { CONSTS } from '../consts';
import { AmpExpression } from '../schemas/AmpExpression';
import { SavingThrowSchema } from '../schemas/SavingThrow';

export const EffectSavingThrowModifier = z
    .strictObject({
        type: z.literal(CONSTS.EFFECT_SAVING_THROW_MODIFIER).describe('fields.EffectType'),
        amp: AmpExpression.describe('fields.amp'),
    })
    .and(SavingThrowSchema);
