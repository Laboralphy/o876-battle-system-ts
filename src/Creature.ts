import { ReactiveStore } from '@laboralphy/reactor';
import { State } from './store/state';
import CONSTS from './consts';

export class Creature {
    private readonly store: ReactiveStore<State>;

    constructor() {
        const state: State = this.buildState();
        this.store = new ReactiveStore(state);
    }

    buildState(): State {
        return {
            specie: CONSTS.SPECIE_HUMANOID,
            race: CONSTS.RACE_HUMAN,
            abilities: {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
            },
            level: 1,
            hitDie: 8,
            naturalArmorClass: 0,
            speed: 30,
            hitPoints: 8,
            properties: [],
            proficiencies: [],
            equipment: {
                [CONSTS.EQUIPMENT_SLOT_HEAD]: null,
                [CONSTS.EQUIPMENT_SLOT_NECK]: null,
                [CONSTS.EQUIPMENT_SLOT_BACK]: null,
                [CONSTS.EQUIPMENT_SLOT_CHEST]: null,
                [CONSTS.EQUIPMENT_SLOT_ARMS]: null,
                [CONSTS.EQUIPMENT_SLOT_FINGER_LEFT]: null,
                [CONSTS.EQUIPMENT_SLOT_FINGER_RIGHT]: null,
                [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: null,
                [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: null,
                [CONSTS.EQUIPMENT_SLOT_AMMO]: null,
                [CONSTS.EQUIPMENT_SLOT_SHIELD]: null,
                [CONSTS.EQUIPMENT_SLOT_WAIST]: null,
                [CONSTS.EQUIPMENT_SLOT_FEET]: null,
                [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1]: null,
                [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2]: null,
                [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3]: null,
            },
            effect: [],
            encumbrance: 0,
            environment: {
                [CONSTS.ENVIRONMENT_DARKNESS]: false,
                [CONSTS.ENVIRONMENT_RAIN]: false,
                [CONSTS.ENVIRONMENT_WIND]: false,
                [CONSTS.ENVIRONMENT_DIFFICULT_TERRAIN]: false,
                [CONSTS.ENVIRONMENT_UNDERWATER]: false,
            },
            actions: [],
            spells: [],
            spellSlots: [
                {
                    level: 0,
                    cooldown: 0,
                    cooldownTimer: 0,
                    count: 0,
                },
                {
                    level: 1,
                    cooldown: 0,
                    cooldownTimer: 0,
                    count: 0,
                },
                {
                    level: 2,
                    cooldown: 0,
                    cooldownTimer: 0,
                    count: 0,
                },
                {
                    level: 3,
                    cooldown: 0,
                    cooldownTimer: 0,
                    count: 0,
                },
                {
                    level: 4,
                    cooldown: 0,
                    cooldownTimer: 0,
                    count: 0,
                },
                {
                    level: 5,
                    cooldown: 0,
                    cooldownTimer: 0,
                    count: 0,
                },
                {
                    level: 6,
                    cooldown: 0,
                    cooldownTimer: 0,
                    count: 0,
                },
                {
                    level: 7,
                    cooldown: 0,
                    cooldownTimer: 0,
                    count: 0,
                },
                {
                    level: 8,
                    cooldown: 0,
                    cooldownTimer: 0,
                    count: 0,
                },
                {
                    level: 9,
                    cooldown: 0,
                    cooldownTimer: 0,
                    count: 0,
                },
            ],
        };
    }
}
