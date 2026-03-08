import { Attack } from '../../../Attack';
import { CONSTS } from '../../../consts';

export function disAttackRollWindyEnvironment(attack: Attack): boolean {
    return (
        attack.attacker.state.environments[CONSTS.ENVIRONMENT_WIND] &&
        attack.attackType === CONSTS.ATTACK_TYPE_RANGED
    );
}
