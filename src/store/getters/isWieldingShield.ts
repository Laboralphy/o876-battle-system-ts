import { State } from '../state';
import { GetterRegistry } from '@laboralphy/reactor/src/Getter';
import { CONSTS } from '../../consts';

/**
 * Determines if the character is currently wielding a shield.
 * Note that, even if equipped, the shield might not be used at all times: if the character is attacking with a two-handed weapon,
 * the shield will not protect the character from damage.
 *
 * @param {State} state - The current state object containing character and equipment information.
 * @param {GetterRegistry} getters - The registry of getter functions for accessing additional state-derived values.
 * @return {boolean} True if the character is wielding a shield and not using a two-handed weapon; otherwise, false.
 */
export function isWieldingShield(state: State, getters: GetterRegistry): boolean {
    return (
        state.equipment[CONSTS.EQUIPMENT_SLOT_SHIELD] != null &&
        !getters.getSelectedWeaponAttributeSet.has(CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED)
    );
}
