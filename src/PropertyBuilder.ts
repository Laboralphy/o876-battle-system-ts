import { randomUUID } from 'node:crypto';
import { Property, PropertyDefinitionSchema } from './properties';
import { TemporaryProperty, TemporaryPropertySchema } from './schemas/TemporaryProperty';
import { Item } from './schemas/Item';

export class PropertyBuilder {
    static buildProperty(propDef: Property): Property {
        return PropertyDefinitionSchema.parse(propDef);
    }

    static buildTemporaryProperty(
        propDef: Property,
        duration: number,
        tag: string
    ): TemporaryProperty {
        return TemporaryPropertySchema.parse({
            property: PropertyDefinitionSchema.parse(propDef),
            id: randomUUID(),
            duration,
            tag,
        });
    }

    /**
     * All item temporary properties duration reduced by 1
     * Temporary property with duration 0 are removed
     */
    static processItemTemporaryProperties(item: Item) {
        const tps = item.temporaryProperties;
        let i = tps.length - 1;
        while (i >= 0) {
            const tp = tps[i];
            --tp.duration;
            if (tp.duration <= 0) {
                tps.splice(i, 1);
            }
            --i;
        }
    }
}
