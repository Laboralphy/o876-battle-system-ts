import { describe, expect, it } from 'vitest';
import { ExtendResolver } from '../src/ExtendResolver';
import * as util from "node:util";

describe('ExtendedResolver', () => {
    it('should return { alpha: 1, beta: 2 } when providing x1: { alpha: 1, extends: [x2] } and x2: { beta: 2 }', () => {
        const xr = new ExtendResolver();
        xr.declareEntity('x1', { alpha: 1, extends: ['x2'] });
        xr.declareEntity('x2', { beta: 2 });
        const x = xr.resolveEntity('x1');
        expect(x).toEqual({
            alpha: 1,
            beta: 2,
        });
    });
    it('should return { alpha: [1, 2] } when providing x1: { alpha: [1], extends: [x2] } and x2: { alpha: [2] }', () => {
        const xr = new ExtendResolver();
        xr.declareEntity('x1', { alpha: [1], extends: ['x2'] });
        xr.declareEntity('x2', { alpha: [2] });
        const x = xr.resolveEntity('x1');
        expect(x).toEqual({
            alpha: [1, 2],
        });
    });
    it('should return a complete creature', () => {
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
                    savingThrow: true,
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
            entityType: 'ENTITY_TYPE_EXTENDED_PROPERTIES',
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
            entityType: 'ENTITY_TYPE_EXTENDED_PROPERTIES',
            properties: [],
            extends: ['cp-construct', 'cp-deflective-skin'],
        };
        const cpDefkectiveSkin = {
            entityType: 'ENTITY_TYPE_EXTENDED_PROPERTIES',
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
        const cpLifeless = {
            "entityType": "ENTITY_TYPE_EXTENDED_PROPERTIES",
            "properties": [
                {
                    "type": "PROPERTY_IMMUNITY",
                    "immunityType": "IMMUNITY_TYPE_DISEASE"
                },
                {
                    "type": "PROPERTY_IMMUNITY",
                    "immunityType": "IMMUNITY_TYPE_DEATH"
                }
            ],
            "extends": ["cp-poison-immunity"]
        };
        const cpPoisonImmunity = {
            "entityType": "ENTITY_TYPE_EXTENDED_PROPERTIES",
            "properties": [
                {
                    "type": "PROPERTY_IMMUNITY",
                    "immunityType": "IMMUNITY_TYPE_POISON"
                },
                {
                    "type": "PROPERTY_DAMAGE_IMMUNITY",
                    "damageType": "DAMAGE_TYPE_POISON"
                }
            ]
        }
        const cpMindless = {
            "entityType": "ENTITY_TYPE_EXTENDED_PROPERTIES",
            "properties": [
                {
                    "type": "PROPERTY_IMMUNITY",
                    "immunityType": "IMMUNITY_TYPE_FEAR"
                },
                {
                    "type": "PROPERTY_IMMUNITY",
                    "immunityType": "IMMUNITY_TYPE_CHARM"
                },
                {
                    "type": "PROPERTY_DAMAGE_IMMUNITY",
                    "damageType": "DAMAGE_TYPE_PSYCHIC"
                }
            ]
        }

        const xr = new ExtendResolver();
        xr.declareEntity('c-golem-bronze', cGolemBronze);
        xr.declareEntity('cp-construct', cpConstruct);
        xr.declareEntity('cp-construct-metal', cpConstructMetal);
        xr.declareEntity('cp-deflective-skin', cpDefkectiveSkin);
        xr.declareEntity('cp-lifeless', cpLifeless);
        xr.declareEntity('cp-poison-immunity', cpPoisonImmunity);
        xr.declareEntity('cp-mindless', cpMindless);
        console.log(util.inspect(xr.resolveEntity('c-golem-bronze'), { depth: null }));
        expect(xr.resolveEntity('c-golem-bronze')).toEqual({
                entityType: 'ENTITY_TYPE_CREATURE',
                classType: 'CLASS_TYPE_MONSTER',
                proficiencies: [
                    'PROFICIENCY_WEAPON_NATURAL',
                    'PROFICIENCY_WEAPON_SIMPLE',
                    'PROFICIENCY_WEAPON_MARTIAL',
                    'PROFICIENCY_ARMOR_LIGHT',
                    'PROFICIENCY_ARMOR_MEDIUM',
                    'PROFICIENCY_ARMOR_HEAVY',
                    'PROFICIENCY_SHIELD'
                ],
                abilities: {
                    strength: 18,
                    dexterity: 9,
                    constitution: 20,
                    intelligence: 3,
                    wisdom: 11,
                    charisma: 1
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
                                damageType: 'DAMAGE_TYPE_FIRE'
                            }
                        ],
                        equipmentSlots: [
                            'EQUIPMENT_SLOT_NATURAL_WEAPON_1',
                            'EQUIPMENT_SLOT_NATURAL_WEAPON_2',
                            'EQUIPMENT_SLOT_NATURAL_WEAPON_3'
                        ]
                    }
                ],
                properties: [
                    {
                        type: 'PROPERTY_SPIKE_DAMAGE',
                        amp: '1d6',
                        damageType: 'DAMAGE_TYPE_FIRE',
                        savingThrow: true,
                        maxDistance: 15
                    },
                    {
                        type: 'PROPERTY_DAMAGE_IMMUNITY',
                        damageType: 'DAMAGE_TYPE_FIRE'
                    },
                    { type: 'PROPERTY_DARKVISION' },
                    { type: 'PROPERTY_ATTACK_COUNT_MODIFIER', amp: 1 },
                    {
                        type: 'PROPERTY_IMMUNITY',
                        immunityType: 'IMMUNITY_TYPE_PARALYSIS'
                    },
                    {
                        type: 'PROPERTY_IMMUNITY',
                        immunityType: 'IMMUNITY_TYPE_PETRIFICATION'
                    },
                    {
                        type: 'PROPERTY_IMMUNITY',
                        immunityType: 'IMMUNITY_TYPE_DISEASE'
                    },
                    { type: 'PROPERTY_IMMUNITY', immunityType: 'IMMUNITY_TYPE_DEATH' },
                    { type: 'PROPERTY_IMMUNITY', immunityType: 'IMMUNITY_TYPE_POISON' },
                    {
                        type: 'PROPERTY_DAMAGE_IMMUNITY',
                        damageType: 'DAMAGE_TYPE_POISON'
                    },
                    { type: 'PROPERTY_IMMUNITY', immunityType: 'IMMUNITY_TYPE_FEAR' },
                    { type: 'PROPERTY_IMMUNITY', immunityType: 'IMMUNITY_TYPE_CHARM' },
                    {
                        type: 'PROPERTY_DAMAGE_IMMUNITY',
                        damageType: 'DAMAGE_TYPE_PSYCHIC'
                    },
                    {
                        type: 'PROPERTY_DAMAGE_RESISTANCE',
                        damageType: 'DAMAGE_TYPE_SLASHING'
                    },
                    {
                        type: 'PROPERTY_DAMAGE_RESISTANCE',
                        damageType: 'DAMAGE_TYPE_PIERCING'
                    }
                ],
                actions: [],
                specie: 'SPECIE_CONSTRUCT',
                armorClass: 8,
                level: 15,
                hitDie: 10,
                speed: 30
            }

        );
    });
    it('should not hang up in an infinite recursive loop', () => {
        const xr = new ExtendResolver();
        xr.declareEntity('x1', { extends: ['x2'] });
        xr.declareEntity('x2', { extends: ['x1'] });
        expect(() => xr.resolveEntity('x1')).not.toThrow();
    })
});
