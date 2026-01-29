export default function getEquipmentSlotProperties (state: State) => {
    const aSlots = [
        // ...getters.getDefensiveSlots,
        // ...getters.getOffensiveSlots
    ];
    const oProperties = {};
    const eq = state.equipment;
    aSlots
        .forEach(slot => {
            const oItem = eq[slot];
            if (!!oItem && oItem.properties.length > 0) {
                if (!(slot in oProperties)) {
                    oProperties[slot] = [];
                }
                oProperties[slot].push(...oItem.properties);
            }
        });
    return oProperties;

};
