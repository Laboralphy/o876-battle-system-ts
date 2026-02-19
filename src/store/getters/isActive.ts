import { State } from '../state';
import { GetterReturnType } from '../define-getters';

export function isActive(state: State) {
    // check if there is at least one effect
    if (state.effects.length > 0) {
        return true;
    }

    // check if one of its action is cooling down
    // or has charges that are resplenishing
    if (
        state.actions.some((action) => {
            if (action.hasCooldown && action.cooldownTimer > 0) {
                return true;
            }
            if (action.cooldownTimer > 0) {
                return true;
            }
            if (action.hasLimitedCharges && action.remainingCharges < action.blueprint.charges) {
                return true;
            }
        })
    ) {
        return true;
    }
}
