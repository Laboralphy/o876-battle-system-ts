import { Attack } from '../../../Attack';
import { CONSTS } from '../../../consts';

/**
 * The attacker has an advantage on attack when the target is disabled (not able to fight)
 * @param attack
 */
export function advAttackRollTargetDisabled(attack: Attack): boolean {
    return !attack.target.getters.getCapabilitySet.has(CONSTS.CAPABILITY_FIGHT);
}
