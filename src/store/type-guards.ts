import { Item } from '../schemas/Item';
import { WeaponBlueprint } from '../schemas/WeaponBlueprint';
import { CONSTS } from '../consts';

export function isWeapon(item: Item | null): item is Item & WeaponBlueprint {
    return !!item && item.itemType === CONSTS.ITEM_TYPE_WEAPON;
}
