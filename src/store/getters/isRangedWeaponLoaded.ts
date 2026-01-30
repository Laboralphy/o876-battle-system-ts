import { State } from '../state';
import { CONSTS } from '../../consts';
import { isWeapon } from '../type-guards';

export function IsRangedWeaponLoaded(state: State) {
    const weapon = state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED];
    if (isWeapon(weapon)) {
        const wa = weapon.attributes;
        if (wa.includes(CONSTS.WEAPON_ATTRIBUTE_AMMUNITION)) {
            const sAmmoType = weapon.ammoType;
            const oAmmo = state.equipment[CONSTS.EQUIPMENT_SLOT_AMMO];
            return !!oAmmo && oAmmo.ammoType === sAmmoType;
        }
    }
    return false;
}
