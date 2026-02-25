import { State } from '../state';
import { GetterReturnType } from '../define-getters';

export function isActive(state: State, getters: GetterReturnType) {
    // check if there is at least one effect
    if (state.effects.length > 0) {
        return true;
    }

    // check if one of its action is cooling down
    // or has charges that are resplenishing
    for (const action of Object.values(getters.getActions)) {
        if (action.recharging) {
            return true;
        }
    }
}
