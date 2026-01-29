import z from 'zod';
import { PropertiesSchema } from '../schemas/Properties';
import CONSTS from '../consts';
import { ItemSchema } from '../schemas/Item';
import { SpecieSchema } from '../schemas/enums/Specie';
import { RaceSchema } from '../schemas/enums/Race';
import { ProficiencySchema } from '../schemas/enums/Proficiency';
import { ActionSchema } from '../schemas/Action';
import { SpellSlotSchema } from '../schemas/SpellSlot';

export const CreatureStateSchema = z.strictObject({
    specie: SpecieSchema,
    race: RaceSchema,
    abilities: z.strictObject({
        strength: z.number(),
        dexterity: z.number(),
        constitution: z.number(),
        intelligence: z.number(),
        wisdom: z.number(),
        charisma: z.number(),
    }),
    level: z.number(),
    hitDie: z.number(),
    naturalArmorClass: z.number(),
    speed: z.number(),
    hitPoints: z.number(),
    properties: PropertiesSchema,
    proficiencies: z.array(ProficiencySchema),
    equipment: z.strictObject({
        [CONSTS.EQUIPMENT_SLOT_HEAD]: ItemSchema.nullable(),
        [CONSTS.EQUIPMENT_SLOT_NECK]: ItemSchema.nullable(),
        [CONSTS.EQUIPMENT_SLOT_BACK]: ItemSchema.nullable(),
        [CONSTS.EQUIPMENT_SLOT_CHEST]: ItemSchema.nullable(),
        [CONSTS.EQUIPMENT_SLOT_ARMS]: ItemSchema.nullable(),
        [CONSTS.EQUIPMENT_SLOT_FINGER_LEFT]: ItemSchema.nullable(),
        [CONSTS.EQUIPMENT_SLOT_FINGER_RIGHT]: ItemSchema.nullable(),
        [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: ItemSchema.nullable(),
        [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: ItemSchema.nullable(),
        [CONSTS.EQUIPMENT_SLOT_AMMO]: ItemSchema.nullable(),
        [CONSTS.EQUIPMENT_SLOT_SHIELD]: ItemSchema.nullable(),
        [CONSTS.EQUIPMENT_SLOT_WAIST]: ItemSchema.nullable(),
        [CONSTS.EQUIPMENT_SLOT_FEET]: ItemSchema.nullable(),
        [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1]: ItemSchema.nullable(),
        [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2]: ItemSchema.nullable(),
        [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3]: ItemSchema.nullable(),
    }),
    effect: z.array(z.number()),
    encumbrance: z.number(),
    environment: z.strictObject({
        [CONSTS.ENVIRONMENT_DARKNESS]: z.boolean(),
        [CONSTS.ENVIRONMENT_RAIN]: z.boolean(),
        [CONSTS.ENVIRONMENT_WIND]: z.boolean(),
        [CONSTS.ENVIRONMENT_DIFFICULT_TERRAIN]: z.boolean(),
        [CONSTS.ENVIRONMENT_UNDERWATER]: z.boolean(),
    }),
    actions: z.array(ActionSchema),
    spells: z.array(z.string()),
    spellSlots: z.array(SpellSlotSchema),
});

export type State = z.infer<typeof CreatureStateSchema>;
