import z from 'zod';
import { PropertyAbilityCheckModifierSchema } from './ability-check-modifier';
import { PropertyAbilityModifierSchema } from './ability-modifier';
import { PropertyAdvantageAttackSchema } from './advantage-attack';
import { PropertyAdvantageSavingThrowSchema } from './advantage-saving-throw';
import { PropertyArmorClassModifier } from './armor-class-modifier';

export const PropertySchema = z.discriminatedUnion('type', [
    PropertyAbilityCheckModifierSchema,
    PropertyAbilityModifierSchema,
    PropertyAdvantageAttackSchema,
    PropertyAdvantageSavingThrowSchema,
    PropertyArmorClassModifier,
]);

export type Property = z.infer<typeof PropertySchema>;
