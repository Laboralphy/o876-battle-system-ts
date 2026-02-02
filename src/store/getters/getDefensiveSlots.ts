import { State } from '../state';
import { CONSTS } from '../../consts';
import { GetterRegistry } from '@laboralphy/reactor/src/Getter';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';

/**
 * Retrieves the list of defensive equipment slots that are currently occupied.
 * The method determines the applicable equipment slots based on the game's logic,
 * including whether a two-handed weapon is wielded.
 *
 * @param {State} state - The current state object containing equipment information.
 * @param {GetterRegistry} getters - A registry of getter functions, used to check
 *                                   specific conditions such as whether a two-handed weapon is equipped.
 * @return {EquipmentSlot[]} An array of defensive equipment slots that are occupied.
 */
export function getDefensiveSlots(state: State, getters: GetterRegistry): EquipmentSlot[] {
    const aSlots: string[] = [
        CONSTS.EQUIPMENT_SLOT_HEAD,
        CONSTS.EQUIPMENT_SLOT_NECK,
        CONSTS.EQUIPMENT_SLOT_CHEST,
        CONSTS.EQUIPMENT_SLOT_BACK,
        CONSTS.EQUIPMENT_SLOT_ARMS,
        CONSTS.EQUIPMENT_SLOT_FINGER_LEFT,
        CONSTS.EQUIPMENT_SLOT_FINGER_RIGHT,
        CONSTS.EQUIPMENT_SLOT_WAIST,
        CONSTS.EQUIPMENT_SLOT_FEET,
    ];
    if (!getters.isWeildingTwoHandedWeapon) {
        aSlots.push(CONSTS.EQUIPMENT_SLOT_SHIELD);
    }
    const eq = state.equipment;
    return aSlots.filter((slot) => eq[slot] !== null);
}
