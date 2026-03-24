import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { PropertyType } from '../../schemas/enums/PropertyType';
import { Property } from '../../properties';

/**
 * Returns a set of properties.
 * Properties are grouped by type.
 */
export function getPropertyRegistry(
    state: State,
    getters: GetterReturnType
): Map<PropertyType, Property[]> {
    const aProperties: Property[] = [...state.properties, ...getters.getEquipmentProperties];
    return aProperties.reduce((prev: Map<PropertyType, Property[]>, curr: Property) => {
        const ps: Property[] | undefined = prev.get(curr.type);
        if (ps) {
            ps.push(curr);
        } else {
            prev.set(curr.type, [curr]);
        }
        return prev;
    }, new Map<PropertyType, Property[]>());
}
