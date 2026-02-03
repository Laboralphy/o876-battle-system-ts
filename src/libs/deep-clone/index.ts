function cloneArray<T>(aArray: T[]): T[] {
    return aArray.map((item) => deepClone(item));
}

function cloneObject<T extends object>(oObject: T): T {
    const oOutput = {} as T;
    for (const sKey in oObject) {
        if (Object.hasOwn(oObject, sKey)) {
            oOutput[sKey] = deepClone(oObject[sKey]);
        }
    }
    return oOutput;
}

/**
 * Deep clones an item.
 * Supports primitives, arrays, objects, Dates, and Sets.
 * Functions are returned by reference.
 *
 * @param oItem The item to clone
 * @returns A deep clone of the item
 */
export function deepClone<T>(oItem: T): T {
    if (oItem === null) {
        return null as unknown as T;
    }

    switch (typeof oItem) {
        case 'object': {
            if (Array.isArray(oItem)) {
                return cloneArray(oItem) as unknown as T;
            } else if (oItem instanceof Date) {
                return new Date(oItem) as unknown as T;
            } else if (oItem instanceof Set) {
                return new Set(cloneArray([...oItem])) as unknown as T;
            } else {
                return cloneObject(oItem as unknown as object) as T;
            }
        }

        case 'number':
        case 'string':
        case 'boolean':
        case 'undefined': {
            return oItem;
        }

        default: {
            // could be a function or bigint or symbol
            return oItem;
        }
    }
}
