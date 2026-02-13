import { State } from '../state';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';
import { Property } from '../../properties';
import { Item } from '../../schemas/Item';
import { GetterReturnType } from '../define-getters';

/**
 * Retrieves the properties associated with equipment slots
 */
export function getEquipmentSlotProperties(
    state: State,
    getters: GetterReturnType
): Record<EquipmentSlot, Property[]> {
    const ds = getters.getDefensiveSlots;
    const os = getters.getOffensiveSlots;
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
