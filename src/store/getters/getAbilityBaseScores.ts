import { State } from '../state';
import { Ability } from '../../schemas/enums/Ability';
import { CONSTS } from '../../consts';

export function getAbilityBaseScores(state: State): Record<Ability, number> {
    return {
        [CONSTS.ABILITY_STRENGTH]: state.abilities[CONSTS.ABILITY_STRENGTH],
        [CONSTS.ABILITY_DEXTERITY]: state.abilities[CONSTS.ABILITY_DEXTERITY],
        [CONSTS.ABILITY_CONSTITUTION]: state.abilities[CONSTS.ABILITY_CONSTITUTION],
        [CONSTS.ABILITY_INTELLIGENCE]: state.abilities[CONSTS.ABILITY_INTELLIGENCE],
        [CONSTS.ABILITY_WISDOM]: state.abilities[CONSTS.ABILITY_WISDOM],
        [CONSTS.ABILITY_CHARISMA]: state.abilities[CONSTS.ABILITY_CHARISMA],
    };
}
