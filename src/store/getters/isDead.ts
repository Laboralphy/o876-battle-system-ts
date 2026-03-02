import { State } from '../state';

/**
 * Return true if the creature is dead (hp is 0 or below)
 * @param state
 */
export function isDead(state: State): boolean {
    return state.hitPoints <= 0;
}
