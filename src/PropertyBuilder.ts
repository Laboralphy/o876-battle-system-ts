import { randomUUID } from 'node:crypto';
import { Property, PropertyDefinition, PropertySchema } from './properties';

export class PropertyBuilder {
    static buildProperty(propDef: PropertyDefinition): Property {
        return PropertySchema.parse({
            ...propDef,
            id: randomUUID(),
            duration: 0,
            temporary: false,
            tag: '',
        });
    }

    static buildTemporaryProperty(propDef: PropertyDefinition, duration: number, tag: string) {
        return PropertySchema.parse({
            ...propDef,
            id: randomUUID(),
            duration,
            temporary: true,
            tag,
        });
    }
}
