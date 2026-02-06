import { describe, it } from 'vitest';
import { EntityFactory } from '../src/EntityFactory';
import { CONSTS } from '../src/consts';

describe('CreatureCreation', () => {
    const cGolemBronze = {
        entityType: 'ENTITY_TYPE_CREATURE',
        classType: 'CLASS_TYPE_MONSTER',
        proficiencies: [
            'PROFICIENCY_WEAPON_NATURAL',
            'PROFICIENCY_WEAPON_SIMPLE',
            'PROFICIENCY_WEAPON_MARTIAL',
            'PROFICIENCY_ARMOR_LIGHT',
            'PROFICIENCY_ARMOR_MEDIUM',
            'PROFICIENCY_ARMOR_HEAVY',
            'PROFICIENCY_SHIELD',
        ],
        abilities: {
            strength: 18,
            dexterity: 9,
            constitution: 20,
            intelligence: 3,
            wisdom: 11,
            charisma: 1,
        },
        equipment: [
            {
                entityType: 'ENTITY_TYPE_ITEM',
                itemType: 'ITEM_TYPE_WEAPON',
                proficiency: 'PROFICIENCY_WEAPON_NATURAL',
                weight: 0,
                size: 'WEAPON_SIZE_SMALL',
                attributes: [],
                damages: '2d10',
                damageType: 'DAMAGE_TYPE_CRUSHING',
                properties: [
                    {
                        type: 'PROPERTY_DAMAGE_MODIFIER',
                        amp: '1d6',
                        damageType: 'DAMAGE_TYPE_FIRE',
                    },
                ],
                equipmentSlots: [
                    'EQUIPMENT_SLOT_NATURAL_WEAPON_1',
                    'EQUIPMENT_SLOT_NATURAL_WEAPON_2',
                    'EQUIPMENT_SLOT_NATURAL_WEAPON_3',
                ],
            },
        ],
        properties: [
            {
                type: 'PROPERTY_SPIKE_DAMAGE',
                amp: '1d6',
                damageType: 'DAMAGE_TYPE_FIRE',
                savingThrow: {
                    ability: CONSTS.ABILITY_DEXTERITY,
                    threat: CONSTS.THREAT_TYPE_FIRE,
                },
                maxDistance: 15,
            },
            {
                type: 'PROPERTY_DAMAGE_IMMUNITY',
                damageType: 'DAMAGE_TYPE_FIRE',
            },
            {
                type: 'PROPERTY_DARKVISION',
            },
            {
                type: 'PROPERTY_ATTACK_COUNT_MODIFIER',
                amp: 1,
            },
        ],
        actions: [],
        specie: 'SPECIE_CONSTRUCT',
        armorClass: 8,
        level: 15,
        hitDie: 10,
        speed: 30,
        extends: ['cp-construct-metal'],
    };
    const cpConstruct = {
        entityType: 'ENTITY_TYPE_PARTIAL_CREATURE',
        properties: [
            {
                type: 'PROPERTY_IMMUNITY',
                immunityType: 'IMMUNITY_TYPE_PARALYSIS',
            },
            {
                type: 'PROPERTY_IMMUNITY',
                immunityType: 'IMMUNITY_TYPE_PETRIFICATION',
            },
        ],
        extends: ['cp-lifeless', 'cp-mindless'],
    };
    const cpConstructMetal = {
        entityType: 'ENTITY_TYPE_PARTIAL_CREATURE',
        properties: [],
        extends: ['cp-construct', 'cp-deflective-skin'],
    };
    const cpDeflectiveSkin = {
        entityType: 'ENTITY_TYPE_PARTIAL_CREATURE',
        properties: [
            {
                type: 'PROPERTY_DAMAGE_RESISTANCE',
                damageType: 'DAMAGE_TYPE_SLASHING',
            },
            {
                type: 'PROPERTY_DAMAGE_RESISTANCE',
                damageType: 'DAMAGE_TYPE_PIERCING',
            },
        ],
    };
    it('should build the golem properly', () => {
        const ef = new EntityFactory();
        ef.declareBlueprint(cpConstruct, 'cp-construct');
        ef.declareBlueprint(cpDeflectiveSkin, 'cp-deflective-skin');
        ef.declareBlueprint(cpConstructMetal, 'cp-construct-metal');
        ef.declareBlueprint(cGolemBronze, 'c-golem-bronze');
    });
});
