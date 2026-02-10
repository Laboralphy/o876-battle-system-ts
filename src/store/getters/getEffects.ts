import { State } from '../state';
import { Effect } from '../../effects';

export function getEffects(state: State): Effect[] {
    return state.effects.filter((effect) => {
        return effect.duration > 0;
    });
}
