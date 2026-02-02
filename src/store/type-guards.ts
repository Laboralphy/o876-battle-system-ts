import { Item } from '../schemas/Item';
import { WeaponProperties } from '../schemas/WeaponProperties';
import { CONSTS } from '../consts';

export function isWeapon(item: Item | null): item is Item & WeaponProperties {
    return !!item && item.itemType === CONSTS.ITEM_TYPE_WEAPON;
}
