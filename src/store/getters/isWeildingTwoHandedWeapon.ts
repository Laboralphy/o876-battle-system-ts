import { State } from '../state';
import { GetterRegistry } from '@laboralphy/reactor/src/Getter';
import { CONSTS } from '../../consts';

export function isWeildingTwoHandedWeapon(state: State, getters: GetterRegistry): boolean {
    const wa = getters.getSelectedWeaponAttributeSet;
    return (
        wa.has(CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED) ||
        (wa.has(CONSTS.WEAPON_ATTRIBUTE_VERSATILE) && !getters.isWieldingShield)
    );
}
