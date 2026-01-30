import z from 'zod';
import CONSTS from '../../consts';

export const SkillSchema = z
    .enum([
        CONSTS.SKILL_SLEIGHT_OF_HAND,
        CONSTS.SKILL_STEALTH,
        CONSTS.SKILL_PERCEPTION,
        CONSTS.SKILL_ATHLETICS,
        CONSTS.SKILL_INVESTIGATION,
        CONSTS.SKILL_ARCANA,
        CONSTS.SKILL_RELIGION,
        CONSTS.SKILL_NATURE,
        CONSTS.SKILL_HISTORY,
        CONSTS.SKILL_INSIGHT,
        CONSTS.SKILL_MEDICINE,
        CONSTS.SKILL_SURVIVAL,
        CONSTS.SKILL_ANIMAL_HANDLING,
        CONSTS.SKILL_PERSUASION,
        CONSTS.SKILL_INTIMIDATION,
        CONSTS.SKILL_DECEPTION,
        CONSTS.SKILL_PERFORMANCE,
    ])
    .describe('fields.skill');

export type Skill = z.infer<typeof SkillSchema>;
