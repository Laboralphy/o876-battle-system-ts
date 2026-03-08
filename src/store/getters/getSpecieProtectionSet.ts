import { GetterReturnType } from '../define-getters';
import { Specie } from '../../schemas/enums/Specie';
import { aggregate } from '../../libs/aggregator';
import { Effect } from '../../effects';
import { CONSTS } from '../../consts';
import { State } from '../state';
import { Property } from '../../properties';

function forEachPropEffect(pe: Effect | Property, aSpecies: Set<Specie>): void {
    if ('specie' in pe && typeof pe.specie === 'string') {
        aSpecies.add(pe.specie);
    }
}

export function getSpecieProtectionSet(state: State, getters: GetterReturnType): Set<Specie> {
    const aSpecies = new Set<Specie>();
    aggregate(
        [CONSTS.PROPERTY_PROTECTION_FROM_SPECIE, CONSTS.EFFECT_PROTECTION_FROM_SPECIE],
        {
            effects: {
                forEach: (eff: Effect) => {
                    forEachPropEffect(eff, aSpecies);
                },
            },
            properties: {
                forEach: (prop: Property) => {
                    forEachPropEffect(prop, aSpecies);
                },
            },
        },
        getters
    );
    return aSpecies;
}
