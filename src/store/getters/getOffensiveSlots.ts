import { State } from '../state';
import { CONSTS } from '../../consts';
import { GetterRegistry } from '@laboralphy/reactor/src/Getter';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';

export function getOffensiveSlots(state: State, getters: GetterRegistry): EquipmentSlot[] {
    const sOffensiveSlot = state.selectedOffensiveSlot;
    const aSlots = [sOffensiveSlot];
    if (sOffensiveSlot === CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED && getters.isRangedWeaponLoaded) {
        aSlots.push(CONSTS.EQUIPMENT_SLOT_AMMO);
    }
    const eq = state.equipment;
    return aSlots.filter((slot) => eq[slot] !== null);
}
