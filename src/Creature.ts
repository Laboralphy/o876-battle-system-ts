import { ReactiveStore } from '@laboralphy/reactor';
import { State } from './store/state';
import { buildStore } from './store';
import { Property, PropertySchema } from './properties';
import { PropertyType } from './schemas/enums/PropertyType';
import { aggregateProperties, AggregatorFunc, AggregatorOptions } from './libs/aggregator';

export class Creature {
    private readonly _store: ReactiveStore<State>;

    constructor() {
        this._store = buildStore();
    }

    get getters() {
        return this._store.getters;
    }

    /**
     * Adds a new innate property to the properties list in the state.
     *
     * @param {Property} property - The property to be added to the innate properties list.
     * @return {Property} The property that was added to the list.
     */
    addInnateProperty(property: Property) {
        const nNewLength = this._store.state.properties.push(PropertySchema.parse(property));
        return this._store.state.properties[nNewLength - 1];
    }

    /**
     * Removes a property from the innate properties list.
     * @param {Property} property - The property to be removed from the innate properties list.
     */
    removeInnateProperty(property: Property) {
        const index = this._store.state.properties.indexOf(property);
        if (index > -1) {
            this._store.state.properties.splice(index, 1);
        }
    }

    aggregateProperties(
        aPropertyTypes: PropertyType[],
        oFunctions: AggregatorFunc<Property>,
        options: AggregatorOptions = {}
    ) {
        return aggregateProperties(aPropertyTypes, this, oFunctions, options);
    }
}
