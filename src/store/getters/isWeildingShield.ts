import { State } from '../state';
import { GetterRegistry } from '@laboralphy/reactor/src/Getter';
import { CONSTS } from '../../consts';

export function isWeildingShield(state: State, getters: GetterRegistry): boolean {
    return (
        state.equipment[CONSTS.EQUIPMENT_SLOT_SHIELD] != null &&
        !getters.getSelectedWeaponAttributeSet.has(CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED)
    );
}
