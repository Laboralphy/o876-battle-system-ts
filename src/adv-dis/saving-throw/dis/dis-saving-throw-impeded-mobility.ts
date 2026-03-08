import { SavingThrowOutcome } from '../../../SavingThrowOutcome';
import { CONSTS } from '../../../consts';

export function disSavingThrowImpededMobility(savingThrowOutcome: SavingThrowOutcome): boolean {
    return (
        savingThrowOutcome.ability === CONSTS.ABILITY_DEXTERITY &&
        !savingThrowOutcome.creature.getters.getCapabilitySet.has(CONSTS.CAPABILITY_MOVE)
    );
}
