import { State } from '../state';
import { Action } from '../../schemas/Action';

function getActions(state: State) {
    return Object.entries(state.actions).map((actionEntry: Action) => {
        const acdt = actionEntry.cooldownTimer;
        const acdtl = acdt.length;
        const recharging = acdtl > 0;
        const charges = actionEntry.blueprint.charges - acdtl; // remaining charge for that day
        // if this action has charges
        const cooldown = actionEntry.hasLimitedCharges ? 0 : acdt[0];
        const ready = actionEntry.hasLimitedCharges ? charges > 0 : true;
        const oAction = {
            id,
            limited: action.limited,
            actionType: action.actionType,
            cooldown,
            charges,
            maxCharges: action.dailyCharges,
            recharging,
            range: action.range,
            script: action.script,
            parameters: action.parameters,
            ready,
            bonus: action.bonus,
            hostile: action.hostile,
            delay: action.delay,
        };
        return [id, oAction];
    });
}
