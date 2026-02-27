import { CONSTS } from '../../consts';
import { Ability } from '../../schemas/enums/Ability';
import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { aggregate } from '../../libs/aggregator';
import { Property } from '../../properties';
import { filterAbility } from '../../libs/prop-effect-filters';

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
    const { discriminator } = aggregate(
        {
            properties: {
                types: [CONSTS.PROPERTY_SAVING_THROW_MODIFIER],
                functions: {
                    discriminator: (p: Property): string => ('ability' in p ? p.ability : ''),
                },
            },
            effects: {
                types: [CONSTS.EFFECT_SAVING_THROW_MODIFIER],
                functions: {
                    discriminator: (e: Property): string => ('ability' in e ? e.ability : ''),
                },
            },
        },
        getters
    );
    const nUniversalBonus = UNIVERSAL in sorter ? sorter[UNIVERSAL].sum : 0;
    const results = {
        [CONSTS.ABILITY_STRENGTH]: nUniversalBonus,
        [CONSTS.ABILITY_DEXTERITY]: nUniversalBonus,
        [CONSTS.ABILITY_CONSTITUTION]: nUniversalBonus,
        [CONSTS.ABILITY_INTELLIGENCE]: nUniversalBonus,
        [CONSTS.ABILITY_WISDOM]: nUniversalBonus,
        [CONSTS.ABILITY_CHARISMA]: nUniversalBonus,
    };
    for (const ability of Object.keys(results)) {
        const sProficiency = getAbilitySavingThrowProficiency(ability);
        const bProficient = getters.getProficiencySet.has(sProficiency);
        const nProfBonus = bProficient ? getters.getProficiencyBonus : 0;
        const nPropEffectBonus = ability in sorter ? sorter[ability].sum : 0;
        results[ability] += nPropEffectBonus + nProfBonus;
    }
    for (const [sThreat, { sum: nThreatBonus }] of Object.entries(sorter)) {
        if (!(sThreat in results)) {
            results[sThreat] = nThreatBonus;
        }
    }
    return results;
}
