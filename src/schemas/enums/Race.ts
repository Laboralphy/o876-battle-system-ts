import z from 'zod';
import CONSTS from '../../consts';

export const RaceSchema = z
    .enum([
        CONSTS.RACE_HUMAN,
        CONSTS.RACE_ELF,
        CONSTS.RACE_DWARF,
        CONSTS.RACE_HALFLING,
        CONSTS.RACE_UNKNOWN,
    ])
    .describe('fields.race');

export type Race = z.infer<typeof RaceSchema>;
