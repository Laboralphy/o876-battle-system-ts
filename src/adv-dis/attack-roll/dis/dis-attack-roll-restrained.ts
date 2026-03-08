import { Attack } from '../../../Attack';
import { CONSTS } from '../../../consts';

export function disAttackRollRestrained(attack: Attack): boolean {
    return !attack.attacker.getters.getCapabilitySet.has(CONSTS.CAPABILITY_MOVE);
}
