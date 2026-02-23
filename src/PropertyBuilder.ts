import { randomUUID } from 'node:crypto';
import { Property, PropertySchema } from './properties';
import { TemporaryProperty, TemporaryPropertySchema } from './schemas/TemporaryProperty';
import { Item } from './schemas/Item';
import { deepClone } from './libs/deep-clone';

export class PropertyBuilder {
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
}
