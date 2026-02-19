import { randomUUID } from 'node:crypto';
import { Property, PropertySchema } from './properties';
import { TemporaryProperty, TemporaryPropertySchema } from './schemas/TemporaryProperty';
import { Item } from './schemas/Item';
import { deepClone } from './libs/deep-clone';

export class PropertyManager {
    /**
     * Build a property from its definition
     * @param propDef - Property definition
     * @returns Property instance (deep cloned from its definition to keep its own mutable data pool)
     */
    static buildProperty(propDef: Property): Property {
        // always deep clone propDef, some properties have their own data pool that can be mutated
        // like health regeneration properties
        return PropertySchema.parse(deepClone(propDef));
    }

    /**
     * Build a temporary property from its definition
     * @param propDef - Property definition
     * @param duration - Duration of the temporary property
     * @param tag - Tag of the temporary property (used to manage stackable temporary properties)
     */
    static buildTemporaryProperty(
        propDef: Property,
        duration: number,
        tag: string
    ): TemporaryProperty {
        return TemporaryPropertySchema.parse({
            property: PropertySchema.parse(deepClone(propDef)),
            id: randomUUID(),
            duration,
            tag,
        });
    }

    /**
     * All item temporary properties duration reduced by 1
     * Temporary properties with duration 0 are removed
     * @param item - Item to process temporary properties
     * @returns List of properties that have been discarded
     */
    static depleteItemTemporaryProperties(item: Item): Property[] {
        const tps = item.temporaryProperties;
        let i = tps.length - 1;
        const aDiscardedProperties: Property[] = [];
        while (i >= 0) {
            const tp = tps[i];
            --tp.duration;
            if (tp.duration <= 0) {
                aDiscardedProperties.push(tp.property);
                tps.splice(i, 1);
            }
            --i;
        }
        return aDiscardedProperties;
    }
}
