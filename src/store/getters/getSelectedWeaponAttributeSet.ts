import { State } from '../state';
import { WeaponAttribute } from '../../schemas/enums/WeaponAttribute';
import { isWeapon } from '../type-guards';

export function getSelectedWeaponAttributeSet(state: State): Set<WeaponAttribute> {
    const w = state.equipment[state.selectedOffensiveSlot];
    if (w && isWeapon(w)) {
        return new Set<WeaponAttribute>(w.attributes);
    }
    return new Set<WeaponAttribute>();
}
