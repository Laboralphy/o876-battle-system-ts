import { State } from '../state';

export function getAbilityScores(state: State) {
    const { sorter } = aggregateModifiers(
        [CONSTS.EFFECT_ABILITY_MODIFIER, CONSTS.PROPERTY_ABILITY_MODIFIER],
        getters,
        {
            effectSorter: filterAbility,
            propSorter: filterAbility,
        }
    );
    return shallowMap(state.abilities, (nValue, sAbility) => {
        const nModifier = sAbility in sorter ? sorter[sAbility].sum : 0;
        return Math.max(1, nValue + nModifier);
    });
}
