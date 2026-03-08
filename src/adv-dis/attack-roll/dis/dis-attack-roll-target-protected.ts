import { Attack } from '../../../Attack';

export function disAttackRollTargetProtected(attack: Attack): boolean {
    const oAttacker = attack.attacker;
    const oTarget = attack.target;
    return oTarget.getters.getSpecieProtectionSet.has(oAttacker.getters.getSpecie);
}
