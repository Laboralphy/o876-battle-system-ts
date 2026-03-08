import { Attack } from '../../../Attack';
import { CONSTS } from '../../../consts';

export function disAttackRollTargetUndetected(attack: Attack): boolean {
    return (
        attack.attacker.getCreatureVisibility(attack.target) !== CONSTS.CREATURE_VISIBILITY_VISIBLE
    );
}
