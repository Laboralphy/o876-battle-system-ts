import PROFICIENCY_BONUS from '../../tables/proficiency-bonus.json';
import { GetterReturnType } from '../define-getters';
import { clamp } from '../../libs/clamp';
import { State } from '../state';

export function getProficiencyBonus(state: State, getters: GetterReturnType): number {
    return PROFICIENCY_BONUS[clamp(getters.getLevel - 1, 0, PROFICIENCY_BONUS.length - 1)];
}
