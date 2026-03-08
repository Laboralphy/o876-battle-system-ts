import { Attack } from '../../../Attack';
import { CONSTS } from '../../../consts';

export function disAttackRollFrightened(attack: Attack): boolean {
    return attack.attacker.getters.getConditionSet.has(CONSTS.CONDITION_FRIGHTENED);
}
