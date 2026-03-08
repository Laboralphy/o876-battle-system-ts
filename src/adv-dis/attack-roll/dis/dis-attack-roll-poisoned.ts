import { Attack } from '../../../Attack';
import { CONSTS } from '../../../consts';

export function disAttackRollPoisoned(attack: Attack): boolean {
    return attack.attacker.getters.getConditionSet.has(CONSTS.CONDITION_POISONED);
}
