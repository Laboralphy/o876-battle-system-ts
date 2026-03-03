import { CONSTS } from '../../consts';
import { Ability } from '../../schemas/enums/Ability';
import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { aggregate, AggregateOptions } from '../../libs/aggregator';
import { discriminatorAbilityThreat } from '../../libs/prop-effect-filters';

const UNIVERSAL = 'UNIVERSAL';

function getAbilitySavingThrowProficiency(sAbility: Ability): string {
    switch (sAbility) {
        case CONSTS.ABILITY_STRENGTH: {
            return CONSTS.PROFICIENCY_SAVING_THROW_STRENGTH;
        }
        case CONSTS.ABILITY_DEXTERITY: {
            return CONSTS.PROFICIENCY_SAVING_THROW_DEXTERITY;
        }
        case CONSTS.ABILITY_CONSTITUTION: {
            return CONSTS.PROFICIENCY_SAVING_THROW_CONSTITUTION;
        }
        case CONSTS.ABILITY_INTELLIGENCE: {
            return CONSTS.PROFICIENCY_SAVING_THROW_INTELLIGENCE;
        }
        case CONSTS.ABILITY_WISDOM: {
            return CONSTS.PROFICIENCY_SAVING_THROW_WISDOM;
        }
        case CONSTS.ABILITY_CHARISMA: {
            return CONSTS.PROFICIENCY_SAVING_THROW_CHARISMA;
        }
        default: {
            throw new Error('unknown saving throw ability ' + sAbility);
        }
    }
}

export function getSavingThrowBonus(state: State, getters: GetterReturnType) {
    const aggopts: AggregateOptions = {
        effects: {
            discriminator: discriminatorAbilityThreat,
        },
        properties: {
            discriminator: discriminatorAbilityThreat,
        },
    };
    const agg = aggregate(
        [CONSTS.PROPERTY_SAVING_THROW_MODIFIER, CONSTS.EFFECT_SAVING_THROW_MODIFIER],
        aggopts,
        getters
    );
    const nUniversalBonus = agg.discriminator[UNIVERSAL]?.sum ?? 0;
    const results: Record<Ability, number> = {
        [CONSTS.ABILITY_STRENGTH]: nUniversalBonus,
        [CONSTS.ABILITY_DEXTERITY]: nUniversalBonus,
        [CONSTS.ABILITY_CONSTITUTION]: nUniversalBonus,
        [CONSTS.ABILITY_INTELLIGENCE]: nUniversalBonus,
        [CONSTS.ABILITY_WISDOM]: nUniversalBonus,
        [CONSTS.ABILITY_CHARISMA]: nUniversalBonus,
    };
    const proficiencySet = new Set(state.proficiencies);
    const disc = agg.discriminator;
    for (const ability of Object.keys(results)) {
        const sProficiency = getAbilitySavingThrowProficiency(ability);
        const bProficient = proficiencySet.has(sProficiency);
        const nProfBonus = bProficient ? getters.getProficiencyBonus : 0;
        const nPropEffectBonus = ability in disc ? disc[ability].sum : 0;
        results[ability] += nPropEffectBonus + nProfBonus;
    }
    for (const [sThreat, { sum: nThreatBonus }] of Object.entries(disc)) {
        if (!(sThreat in results)) {
            results[sThreat] = nThreatBonus;
        }
    }
    return results;
}
