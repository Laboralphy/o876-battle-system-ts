import { Attack } from '../../../Attack';
import { CONSTS } from '../../../consts';

export function advAttackRollUndetectedByTarget(attack: Attack) {
    return (
        attack.target.getCreatureVisibility(attack.attacker) === CONSTS.CREATURE_VISIBILITY_VISIBLE
    );
}
