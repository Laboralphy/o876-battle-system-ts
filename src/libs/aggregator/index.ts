import { Creature } from '../../Creature';
import { Property } from '../../properties';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';
import { PropertyType } from '../../schemas/enums/PropertyType';

export interface AggregatorFunc<T extends Property> {
    filter?(pe: T): boolean;
    ampMapper?(pe: T): number;
    discriminator?(pe: T): string;
    forEach?(pe: T): void;
}

export type AggregatorOptions = {
    excludeInnate?: boolean;
    restrictSlots?: EquipmentSlot[];
};

export function aggregateProperties(
    aWantedProperties: PropertyType[],
    creature: Creature,
    oFunctions: AggregatorFunc<Property>,
    options: AggregatorOptions
) {
    const restrictSlots: EquipmentSlot[] = options?.restrictSlots ?? [];
    const excludeInnate = options?.excludeInnate ?? false;
    const aTypeSet = new Set<PropertyType>(aWantedProperties);
    // Initially starting with an empty array
    const aStartingProperties = [];
    if (restrictSlots.length > 0) {
        // There are sllot restriction
        // Only get properties from item of these slots
        if (!excludeInnate) {
            // Adds innate properties unless specified otherwise
            aStartingProperties.push(...creature.getters.getInnateProperties);
        }
        // Get all properties ...
        const oSlotProperties = creature.getters.getEquipmentSlotProperties;
        // But keep only properties for item of restricted slots
        restrictSlots.forEach((s: EquipmentSlot) => {
            if (oSlotProperties[s]) {
                aStartingProperties.push(...oSlotProperties[s]);
            }
        });
    } else {
        // No slot restriction
        if (!options.excludeInnate) {
            // include innate properties
            aStartingProperties.push(...creature.getters.getInnateProperties);
        }
        // Getting all equipement item properties
        aStartingProperties.push(...creature.getters.getEquipmentProperties);
    }
    const aFilteredProperties: Property[] = aStartingProperties
        .filter(
            (ip) => aTypeSet.has(ip.type) && (oFunctions?.filter ? oFunctions.filter(ip) : true)
        )
        .map((prop) => ({
            ...prop,
            amp: oFunctions?.ampMapper ? oFunctions.ampMapper(prop) : prop.amp,
        }));
    if (oFunctions?.forEach) {
        // Applies a forEach function to all properties
        aFilteredProperties.forEach(oFunctions.forEach);
    }
    const oSorter: Record<string, { sum: number; max: number; count: number }> = {};
    const getDiscriminatorRegistry = (sDisc: string) => {
        if (!(sDisc in oSorter)) {
            oSorter[sDisc] = {
                sum: 0,
                max: 0,
                count: 0,
            };
        }
        return oSorter[sDisc];
    };
    if (typeof oFunctions?.discriminator === 'function') {
        aFilteredProperties.forEach((pe: Property) => {
            if (typeof oFunctions?.discriminator === 'function') {
                const sd = getDiscriminatorRegistry(oFunctions.discriminator(pe));
                const amp: number = 'amp' in pe ? pe.amp : 0;
                if (Number.isNaN(amp)) {
                    throw TypeError('Effect amp has not been properly evaluated');
                }
                sd.max = Math.max(sd.max, amp);
                sd.sum += amp;
                ++sd.count;
            }
        });
    }
    let nIPAcc = 0,
        nMin = Infinity,
        nMax = -Infinity;
    aFilteredProperties.forEach((pe: Property) => {
        if ('amp' in pe) {
            if (!Number.isNaN(pe.amp)) {
                nIPAcc += pe.amp;
                nMax = Math.max(nMax, pe.amp);
                nMin = Math.min(nMin, pe.amp);
            }
        }
    });
    return {
        sum: nIPAcc,
        max: nMax,
        min: nMin,
        count: aFilteredProperties.length,
        discriminator: oSorter,
    };
}
