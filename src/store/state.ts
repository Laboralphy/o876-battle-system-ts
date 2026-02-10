import z from 'zod';
import { CONSTS } from '../consts';
import { SpecieSchema } from '../schemas/enums/Specie';
import { RaceSchema } from '../schemas/enums/Race';
import { ProficiencySchema } from '../schemas/enums/Proficiency';
import { ActionSchema } from '../schemas/Action';
import { SpellSlotSchema } from '../schemas/SpellSlot';
import { EquipmentSchema } from '../schemas/Equipment';
import { EquipmentSlotSchema } from '../schemas/enums/EquipmentSlot';
import { PropertySchema } from '../properties';
import { EffectSchema } from '../effects';

export const CreatureStateSchema = z.strictObject({
    specie: SpecieSchema,
    race: RaceSchema.or(z.literal('')),
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
    armorClass: z.number(),
    speed: z.number(),
    hitPoints: z.number(),
    properties: z.array(PropertySchema),
    proficiencies: z.array(ProficiencySchema),
    equipment: EquipmentSchema,
    selectedOffensiveSlot: EquipmentSlotSchema,
    effects: z.array(EffectSchema),
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
