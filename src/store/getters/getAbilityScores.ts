import { State } from '../state';
import { aggregate } from '../../libs/aggregator';
import { CONSTS } from '../../consts';
import { Property } from '../../properties';
import { Effect } from '../../effects';
import { GetterReturnType } from '../define-getters';
import { Ability } from '../../schemas/enums/Ability';

export function getAbilityScores(state: State, getters: GetterReturnType): Record<Ability, number> {
    const { discriminator } = aggregate(
        [CONSTS.PROPERTY_ABILITY_MODIFIER, CONSTS.EFFECT_ABILITY_MODIFIER],
        {
            properties: {
                discriminator: (prop: Property): string => ('ability' in prop ? prop.ability : ''),
            },
            effects: {
                discriminator: (eff: Effect): string => ('ability' in eff ? eff.ability : ''),
            },
        },
        getters
    );
    return {
        [CONSTS.ABILITY_STRENGTH]:
            state.abilities[CONSTS.ABILITY_STRENGTH] +
            (discriminator[CONSTS.ABILITY_STRENGTH]?.sum ?? 0),
        [CONSTS.ABILITY_DEXTERITY]:
            state.abilities[CONSTS.ABILITY_DEXTERITY] +
            (discriminator[CONSTS.ABILITY_DEXTERITY]?.sum ?? 0),
        [CONSTS.ABILITY_CONSTITUTION]:
            state.abilities[CONSTS.ABILITY_CONSTITUTION] +
            (discriminator[CONSTS.ABILITY_CONSTITUTION]?.sum ?? 0),
        [CONSTS.ABILITY_INTELLIGENCE]:
            state.abilities[CONSTS.ABILITY_INTELLIGENCE] +
            (discriminator[CONSTS.ABILITY_INTELLIGENCE]?.sum ?? 0),
        [CONSTS.ABILITY_WISDOM]:
            state.abilities[CONSTS.ABILITY_WISDOM] +
            (discriminator[CONSTS.ABILITY_WISDOM]?.sum ?? 0),
        [CONSTS.ABILITY_CHARISMA]:
            state.abilities[CONSTS.ABILITY_CHARISMA] +
            (discriminator[CONSTS.ABILITY_CHARISMA]?.sum ?? 0),
    };
}
