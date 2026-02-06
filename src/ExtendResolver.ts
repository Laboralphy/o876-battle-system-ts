export interface ExtendableEntity {
    extends?: string[];
    [key: string]: any;
}

/**
 * This class is aimed at resolving extends inside JSON structure
 */
export class ExtendResolver {
    private readonly entities = new Map<string, ExtendableEntity>();

    declareEntity(ref: string, obj: ExtendableEntity): void {
        this.entities.set(ref, obj);
    }

    resolveEntity(ref: string): ExtendableEntity {
        const baseEntity = { ...this.entities.get(ref) } as ExtendableEntity;
        if (baseEntity) {
            for (const x of baseEntity.extends ?? []) {
                const extendedEntity = this.resolveEntity(x);
                for (const [name, value] of Object.entries(extendedEntity)) {
                    const bAlreadyDefined = name in baseEntity;
                    const bPropIsArray =
                        bAlreadyDefined &&
                        Array.isArray(baseEntity[name]) &&
                        Array.isArray(extendedEntity[name]);
                    if (bPropIsArray) {
                        // Property is already defined and is an array
                        baseEntity[name] = [...baseEntity[name], ...extendedEntity[name]];
                    }
                    if (!(name in baseEntity)) {
                        // This property does not exist in base entity
                        // We can set it in the base entity
                        baseEntity[name] = value;
                    }
                }
            }
            delete baseEntity.extends;
            return baseEntity;
        } else {
            throw new ReferenceError(`Entity ${ref} not found`);
        }
    }
}
