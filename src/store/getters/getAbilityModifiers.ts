import { State } from '../state';
import { CONSTS } from '../../consts';
import { GetterReturnType } from '../define-getters';
import { Ability } from '../../schemas/enums/Ability';

function computeModifier(value: number): number {
    const n = (value - 10) / 2;
    return value >= 10 ? Math.floor(n) : Math.ceil(n);
}

/**
 * Compute ability modifiers from ability scores
 * @param state
 * @param getters
 */
export function getAbilityModifiers(
    state: State,
    getters: GetterReturnType
): Record<Ability, number> {
    const abilityScores = getters.getAbilityScores;
    return {
        [CONSTS.ABILITY_STRENGTH]: computeModifier(abilityScores[CONSTS.ABILITY_STRENGTH]),
        [CONSTS.ABILITY_DEXTERITY]: computeModifier(abilityScores[CONSTS.ABILITY_DEXTERITY]),
        [CONSTS.ABILITY_CONSTITUTION]: computeModifier(abilityScores[CONSTS.ABILITY_CONSTITUTION]),
        [CONSTS.ABILITY_INTELLIGENCE]: computeModifier(abilityScores[CONSTS.ABILITY_INTELLIGENCE]),
        [CONSTS.ABILITY_WISDOM]: computeModifier(abilityScores[CONSTS.ABILITY_WISDOM]),
        [CONSTS.ABILITY_CHARISMA]: computeModifier(abilityScores[CONSTS.ABILITY_CHARISMA]),
    };
}
