import { State } from '../state';
import { CONSTS } from '../../consts';
import { GetterReturnType } from '../define-getters';

/**
 * Determines if the character is currently using a two-handed weapon.
 * This function requires that a weapon is selected.
 * If the character is equipping a dagger and a bow and currently attacking with dagger, this getter
 * should return false. If the character switches to bow for a ranged attack, the getter should return true.
 *
 * @param {State} state - The current state of the application.
 * @return {boolean} True if the selected weapon is two-handed or versatile without a shield; otherwise, false.
 */
export function isWieldingTwoHandedWeapon(state: State, getters: GetterReturnType): boolean {
    const wa = getters.getSelectedWeaponAttributeSet;
    return (
        wa.has(CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED) ||
        (wa.has(CONSTS.WEAPON_ATTRIBUTE_VERSATILE) && !getters.isWieldingShield)
    );
}
