import { State } from '../state';
import { aggregate } from '../../libs/aggregator';
import { CONSTS } from '../../consts';
import { Property } from '../../properties';
import { Ability } from '../../schemas/enums/Ability';
import z from 'zod';
import { PropertyAbilityModifier } from '../../properties/ability-modifier';

type PropertyAbilityModifierType = z.infer<typeof PropertyAbilityModifier>;

function isPropertyAbilityModifier(prop: object): prop is PropertyAbilityModifierType {
    return 'type' in prop && prop.type === CONSTS.PROPERTY_ABILITY_MODIFIER;
}

function getAbilityScore(state: State, ability: Ability) {
    return aggregate({
        properties: {
            types: [CONSTS.PROPERTY_ABILITY_MODIFIER],
            functions: {
                discriminator: (prop: Property): boolean => {
                    return isPropertyAbilityModifier(prop) && prop.ability === ability;
                }
            }
}

export function getAbilityScores(state: State) {
    const x = aggregate({
        properties: {
            types: [CONSTS.PROPERTY_ABILITY_MODIFIER],
            functions: {
                discriminator: (prop: Property) => {
                    return 'type' in prop && prop.type === CONSTS.PROPERTY_ABILITY_MODIFIER && prop.ability === ;
                }
            }

        }
        }
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
