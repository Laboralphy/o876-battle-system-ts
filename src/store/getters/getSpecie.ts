import { State } from '../state';

/**
 * Returns the creature specie (or current speci if polymorphed)
 * @param state
 */
export function getSpecie(state: State) {
    return state.specie;
}
