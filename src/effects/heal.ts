import z from 'zod';
import { CONSTS } from '../consts';
import { DiceExpression } from '../schemas/DiceExpression';

export const EffectHeal = z.strictObject({
    type: CONSTS.EFFECT_HEAL,
    amp: DiceExpression.or(z.number().int().positive()),
});
