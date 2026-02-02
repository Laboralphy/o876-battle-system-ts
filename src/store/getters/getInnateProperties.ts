import { State } from '../state';
import { Property } from '../../properties';

/**
 * Returns the innate properties of the creature
 */
export function getInnateProperties(state: State): Property[] {
    return state.properties.slice(0);
}
