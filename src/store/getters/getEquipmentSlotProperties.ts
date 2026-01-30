import { State } from '../state';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';
import { Property } from '../../schemas/enums/Property';

export function getEquipmentSlotProperties(state: State) {
    const aSlots: Property[] = [
        // ...getters.getDefensiveSlots,
        // ...getters.getOffensiveSlots
    ];
    const oProperties: Record<EquipmentSlot, Property[]> = {};
    const eq = state.equipment;
    aSlots.forEach((slot) => {
        const oItem = eq[slot];
        if (!!oItem && oItem.properties.length > 0) {
            if (!(slot in oProperties)) {
                oProperties[slot] = [];
            }
            oProperties[slot].push(...oItem.properties);
        }
    });
    return oProperties;
}
