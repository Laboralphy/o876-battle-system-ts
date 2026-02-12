import { State } from '../state';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';
import { Property } from '../../properties';
import { Item } from '../../schemas/Item';
import { GetterReturnType } from '../define-getters';

/**
 * Retrieves the properties associated with equipment slots
 *
 * @param {State} state - The application's state object, containing the current equipment configuration.
 * @param {GetterRegistry} getters - The registry of getter functions used to retrieve slot-related data.
 * @return {Record<EquipmentSlot, Property[]>} An object mapping each equipment slot to a list of its associated properties.
 */
export function getEquipmentSlotProperties(
    state: State,
    getters: GetterReturnType
): Record<EquipmentSlot, Property[]> {
    const ds = getters.getDefensiveSlots as EquipmentSlot[];
    const os = getters.getOffensiveSlots as EquipmentSlot[];
    const aSlots: EquipmentSlot[] = [...ds, ...os];
    const oProperties: Record<EquipmentSlot, Property[]> = {};
    const eq = state.equipment;
    aSlots.forEach((slot) => {
        const oItem: Item | null = eq[slot];
        if (oItem && oItem.properties.length > 0) {
            if (!(slot in oProperties)) {
                oProperties[slot] = [];
            }
            oProperties[slot].push(...oItem.properties);
        }
    });
    return oProperties;
}
