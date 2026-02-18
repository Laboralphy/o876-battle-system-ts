import z from 'zod';
import { CONSTS } from '../consts';
import { PropertyDefinitionSchema } from '../properties';
import { ItemBlueprintSchema } from './Item';
import { ActionSchema } from './Action';
import { SpecieSchema } from './enums/Specie';
import { RaceSchema } from './enums/Race';
import { FeatTypeSchema } from './enums/FeatType';
import { ProficiencySchema } from './enums/Proficiency';
import { SkillProficiencySchema } from './enums/SkillProficiency';

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
    armorClass: z.number().int().describe('fields.CreatureField.ac'),
    hitDie: z.number().int().min(1).describe('fields.CreatureField.hitDie'),
    specie: SpecieSchema,
    race: RaceSchema.optional().describe('fields.CreatureField.race'),
    speed: z.number().int().min(0).describe('fields.CreatureField.speed'),
    feats: z.array(FeatTypeSchema).describe('fields.CreatureField.feats'),
    properties: z.array(PropertyDefinitionSchema).describe('fields.CreatureField.properties'),
    equipment: z
        .array(z.union([ItemBlueprintSchema, z.string()]))
        .describe('fields.CreatureField.equipment'),
    proficiencies: z
        .array(z.union([ProficiencySchema, SkillProficiencySchema]))
        .describe('fields.CreatureField.proficiencies'),
    actions: z.array(ActionSchema).describe('fields.CreatureField.actions'),
    spells: z.array(z.string()).optional().describe('fields.CreatureField.spells'),
    extends: z.array(z.string()).optional(),
});

export type CreatureBlueprint = z.infer<typeof CreatureBlueprintSchema>;
