import { State } from '../state';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';
import { PropertyType } from '../../schemas/enums/PropertyType';
import { GetterRegistry } from '@laboralphy/reactor/src/Getter';

export function getEquipmentSlotProperties(state: State, getters: GetterRegistry) {
    const aSlots: PropertyType[] = [
        ...getters.getDefensiveSlots,
        // ...getters.getOffensiveSlots
    ];
    const oProperties: Record<EquipmentSlot, PropertyType[]> = {};
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
