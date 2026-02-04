import z from 'zod';
import { CONSTS } from '../consts';
import { PropertySchema } from '../properties';
import { ItemBlueprintSchema } from './Item';
import { ActionSchema } from './Action';
import { SpecieSchema } from './enums/Specie';
import { RaceSchema } from './enums/Race';
import { FeatTypeSchema } from './enums/FeatType';
import { ProficiencySchema } from './enums/Proficiency';

export const CreatureBlueprintSchema = z.strictObject({
    entityType: z.literal(CONSTS.ENTITY_TYPE_CREATURE).describe('fields.CreatureField.entityType'),
    classType: z.string(),
    level: z.number().int().min(1).describe('fields.CreatureField.level'),
    abilities: z.object({
        strength: z.number().int().min(1).describe('fields.CreatureField.strength'),
        dexterity: z.number().int().min(1).describe('fields.CreatureField.dexterity'),
        constitution: z.number().int().min(1).describe('fields.CreatureField.constitution'),
        intelligence: z.number().int().min(1).describe('fields.CreatureField.intelligence'),
        wisdom: z.number().int().min(1).describe('fields.CreatureField.wisdom'),
        charisma: z.number().int().min(1).describe('fields.CreatureField.charisma'),
    }),
    ac: z.number().int().describe('fields.CreatureField.ac'),
    hitDie: z.number().int().min(1).describe('fields.CreatureField.hitDie'),
    specie: SpecieSchema,
    race: RaceSchema.optional().describe('fields.CreatureField.race'),
    speed: z.number().int().min(0).describe('fields.CreatureField.speed'),
    feats: z.array(FeatTypeSchema).optional().describe('fields.CreatureField.feats'),
    properties: z.array(PropertySchema).describe('fields.CreatureField.properties'),
    equipment: z.array(ItemBlueprintSchema).describe('fields.CreatureField.equipment'),
    proficiencies: z.array(ProficiencySchema).describe('fields.CreatureField.proficiencies'),
    actions: z.array(ActionSchema).describe('fields.CreatureField.actions'),
    spells: z.array(z.string()).optional().describe('fields.CreatureField.spells'),
});

export type CreatureBlueprint = z.infer<typeof CreatureBlueprintSchema>;
