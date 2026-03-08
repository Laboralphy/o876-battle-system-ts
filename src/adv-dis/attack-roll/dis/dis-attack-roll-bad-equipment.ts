import { Attack } from '../../../Attack';
import { CONSTS } from '../../../consts';

export function disAttackRollBadEquipment(attack: Attack) {
    const eqp = attack.attacker.getters.isEquipmentProficient;
    return !(eqp[CONSTS.EQUIPMENT_SLOT_CHEST] && eqp[CONSTS.EQUIPMENT_SLOT_SHIELD]);
}
