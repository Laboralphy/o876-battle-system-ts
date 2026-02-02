import { State } from '../state';
import { GetterRegistry } from '@laboralphy/reactor/src/Getter';
import { Property } from '../../properties';

export function getEquipmentProperties(state: State, getters: GetterRegistry): Property[] {
    return Object.values(getters.getEquipmentSlotProperties as Property[]).flat();
}
