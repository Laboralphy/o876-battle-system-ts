import { State } from '../state';
import { Action } from '../../schemas/Action';

export type GetACtionReturnType = {
    id: string;
    actionType: string;
    cooldown: number;
    charges: number;
    maxCharges: number;
    recharging: boolean;
    range: number;
    script: string;
    parameters: Record<string, never> | undefined;
    ready: boolean;
    bonus: boolean;
    hostile: boolean;
    delay: number;
};

export function getActions(state: State): { [id: string]: GetACtionReturnType } {
    return Object.fromEntries(
        Object.entries(state.actions).map(([id, action]: [string, Action]) => {
            const ab = action.blueprint;
            const cd = action.cooldownTimer;
            // charges that are already used
            const totalCharges = ab.charges;
            const usedCharges = cd.length;
            const remainingCharges = totalCharges - usedCharges;
            const bHasRemainingCharges = remainingCharges > 0;
            // if no used charge : 0
            // else if there is one+ remaining charge(s) : 0
            // else value of the first cooldown timer
            const cooldown = bHasRemainingCharges ? 0 : cd[0];
            // Action is ready if the cooldown timer is 0
            const ready = cooldown === 0;
            const oAction = {
                id, // action identifier
                actionType: ab.actionType, // action type
                cooldown, // timer before
                charges: remainingCharges,
                maxCharges: ab.charges,
                recharging: cooldown > 0,
                range: ab.range,
                script: ab.script,
                parameters: ab.parameters,
                ready,
                bonus: ab.bonus,
                hostile: ab.hostile,
                delay: action.delayTimer,
            };
            return [id, oAction];
        })
    );
}
