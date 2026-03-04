import { Attack } from '../../../Attack';
import { CONSTS } from '../../../consts';

export function advAttackRollTargetRestrained(attack: Attack): boolean {
    return !attack.target.getters.getCapabilitySet.has(CONSTS.CAPABILITY_MOVE);
}
