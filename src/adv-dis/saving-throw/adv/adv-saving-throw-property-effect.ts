import { SavingThrowOutcome } from '../../../SavingThrowOutcome';
import { Property } from '../../../properties';
import { Effect } from '../../../effects';
import { CONSTS } from '../../../consts';
import { aggregate } from '../../../libs/aggregator';

export function advSavingThrowPropertyEffect(savingThrowOutcome: SavingThrowOutcome) {
    const f = (propOrEffect: Property | Effect): boolean =>
        ('ability' in propOrEffect && propOrEffect.ability === savingThrowOutcome.ability) ||
        ('threat' in propOrEffect && propOrEffect.threat === savingThrowOutcome.threat);

    return (
        aggregate(
            [CONSTS.PROPERTY_ADVANTAGE_SAVING_THROW, CONSTS.EFFECT_ADVANTAGE_SAVING_THROW],
            {
                properties: {
                    filter: f,
                },
                effects: {
                    filter: f,
                },
            },
            savingThrowOutcome.creature.getters
        ).count > 0
    );
}
