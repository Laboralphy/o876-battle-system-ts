import { State } from '../state';
import { GetterReturnType } from '../define-getters';

/**
 * Returns the difficulty class of the creature
 */
export function getDifficultyClass(state: State, getters: GetterReturnType): number {
    return 8 + getters.getProficiencyBonus;
}
