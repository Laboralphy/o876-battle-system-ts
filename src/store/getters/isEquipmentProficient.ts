import { Item } from '../../schemas/Item';
import { CONSTS } from '../../consts';
import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';

/**
 * Return true if item proficiency is supported by proficiency set
 * @param aProficiencies
 * @param oItem
 * @param bNaturalSlot if true then this slot is a natural weapon slot and mays use natural weapon proficiency
 * @returns
 */
function isProficient(
    aProficiencies: Set<string>,
    oItem: Item | null,
    bNaturalSlot: boolean = false
) {
    if (bNaturalSlot && !oItem) {
        return aProficiencies.has(CONSTS.PROFICIENCY_WEAPON_NATURAL);
    } else if (!oItem) {
        return true;
    }
    const sProficiency = 'proficiency' in oItem ? oItem.proficiency : '';
    return sProficiency === '' || aProficiencies.has(sProficiency);
}

export function isEquipmentProficient(state: State): Record<EquipmentSlot, boolean> {
    const eq = state.equipment;
    const aProficiencies = new Set(state.proficiencies);
    return {
        [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: isProficient(
            aProficiencies,
            eq[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED],
            true
        ),
        [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: isProficient(
            aProficiencies,
            eq[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE],
            true
        ),
        [CONSTS.EQUIPMENT_SLOT_CHEST]: isProficient(
            aProficiencies,
            eq[CONSTS.EQUIPMENT_SLOT_CHEST]
        ),
        [CONSTS.EQUIPMENT_SLOT_SHIELD]: isProficient(
            aProficiencies,
            eq[CONSTS.EQUIPMENT_SLOT_SHIELD]
        ),
    };
}
