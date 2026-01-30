import { ReactiveStore } from '@laboralphy/reactor';
import { State } from './state';

import { getDefensiveSlots } from './getters/getDefensiveSlots';
import { getEquipmentSlotProperties } from './getters/getEquipmentSlotProperties';
import { getInnateProperties } from './getters/getInnateProperties';
import { getSelectedWeaponAttributeSet } from './getters/getSelectedWeaponAttributeSet';
import { isWeildingShield } from './getters/isWeildingShield';
import { isWeildingTwoHandedWeapon } from './getters/isWeildingTwoHandedWeapon';

export function defineGetters(store: ReactiveStore<State>) {
    store.defineGetter('getDefensiveSlots', getDefensiveSlots);
    store.defineGetter('getEquipmentSlotProperties', getEquipmentSlotProperties);
    store.defineGetter('getInnateProperties', getInnateProperties);
    store.defineGetter('getSelectedWeaponAttributeSet', getSelectedWeaponAttributeSet);
    store.defineGetter('isWeildingShield', isWeildingShield);
    store.defineGetter('isWeildingTwoHandedWeapon', isWeildingTwoHandedWeapon);
}
