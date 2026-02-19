import {Creature} from "../src/Creature";
import {EntityFactory} from "../src/EntityFactory";
import {CONSTS} from "../src/consts";
import {PropertyManager} from "../src/PropertyManager";

describe('TemporaryProperties', () => {
    it('should return strengthg = 12 when temporary property has duration > 0', () => {
        const c = new Creature();
        const ef = new EntityFactory();
        const ringOfStrength = ef.createItem({
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_RING,
            weight: 1,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_FINGER_RIGHT, CONSTS.EQUIPMENT_SLOT_FINGER_LEFT],
            properties: []
        })
        expect(ringOfStrength).toHaveProperty('temporaryProperties')
        expect(ringOfStrength.temporaryProperties).toEqual([])
        const eqo = c.equipItem(ringOfStrength);
        expect(eqo.equippedItem).toBeDefined()
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_STRENGTH]).toBe(10);
        ef.addItemTemporaryProperty(eqo.equippedItem, {
            type: CONSTS.PROPERTY_ABILITY_MODIFIER,
            ability: CONSTS.ABILITY_STRENGTH,
            amp: 2,
        }, 3, '');
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_STRENGTH]).toBe(12)
        PropertyManager.depleteItemTemporaryProperties(eqo.equippedItem) // duration of temp prop : 2
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_STRENGTH]).toBe(12)
        PropertyManager.depleteItemTemporaryProperties(eqo.equippedItem) // duration of temp prop : 1
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_STRENGTH]).toBe(12)
        PropertyManager.depleteItemTemporaryProperties(eqo.equippedItem) // duration of temp prop : 0
        // temp prop is expired and removed
        expect(c.getters.getAbilityScores[CONSTS.ABILITY_STRENGTH]).toBe(10)
    })
})
