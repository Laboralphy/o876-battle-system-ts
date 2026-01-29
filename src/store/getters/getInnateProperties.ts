import { State } from '../state';
import { Properties } from '../../schemas/Properties';

/**
 * Returns the innate properties of the creature
 */
export function getInnateProperties(state: State): Properties {
    return state.properties.slice(0);
}
