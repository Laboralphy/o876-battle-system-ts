import { Property } from '../../properties';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';
import { PropertyType } from '../../schemas/enums/PropertyType';
import { EffectType } from '../../schemas/enums/EffectType';
import { Effect } from '../../effects';
import { GetterReturnType } from '../../store/define-getters';

export interface AggregatorFunc<T extends Property | Effect> {
    filter?(pe: T): boolean;
    ampMapper?(pe: T): number;
    discriminator?(pe: T): string;
    forEach?(pe: T): void;
}

export type AggregatorOptions = {
    excludeInnate?: boolean;
    restrictSlots?: EquipmentSlot[];
};

export type AggregatorAccumulator = {
    sum: number;
    max: number;
    min: number;
    count: number;
};

export function aggregateProperties(
    aWantedProperties: PropertyType[],
    getters: GetterReturnType,
    oFunctions: AggregatorFunc<Property>,
    options: AggregatorOptions
): AggregatorAccumulator & { discriminator: Record<string, AggregatorAccumulator> } {
    const restrictSlots: EquipmentSlot[] = options?.restrictSlots ?? [];
    const excludeInnate = options?.excludeInnate ?? false;
    const aTypeSet = new Set<PropertyType>(aWantedProperties);
    // Initially starting with an empty array
    const aStartingProperties: Property[] = [];
    if (restrictSlots.length > 0) {
        // There are sllot restriction
        // Only get properties from item of these slots
        if (!excludeInnate) {
            // Adds innate properties unless specified otherwise
            aStartingProperties.push(...getters.getInnateProperties);
        }
        // Get all properties ...
        const oSlotProperties = getters.getEquipmentSlotProperties;
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
            aStartingProperties.push(...getters.getInnateProperties);
        }
        // Getting all equipement item properties
        aStartingProperties.push(...getters.getEquipmentProperties);
    }
    const aFilteredProperties: Property[] = aStartingProperties
        .filter(
            (ip) => aTypeSet.has(ip.type) && (oFunctions?.filter ? oFunctions.filter(ip) : true)
        )
        .map((prop: Property): Property => {
            if ('amp' in prop) {
                return {
                    ...prop,
                    amp: oFunctions?.ampMapper ? oFunctions.ampMapper(prop) : prop.amp,
                };
            } else {
                return prop;
            }
        });
    if (oFunctions?.forEach) {
        // Applies a forEach function to all properties
        aFilteredProperties.forEach(oFunctions.forEach);
    }
    const oSorter: Record<string, AggregatorAccumulator> = {};
    const getDiscriminatorRegistry = (sDisc: string) => {
        if (!(sDisc in oSorter)) {
            oSorter[sDisc] = {
                sum: 0,
                min: Infinity,
                max: -Infinity,
                count: 0,
            };
        }
        return oSorter[sDisc];
    };
    if (typeof oFunctions?.discriminator === 'function') {
        aFilteredProperties.forEach((pe: Property) => {
            if (typeof oFunctions?.discriminator === 'function') {
                const sd = getDiscriminatorRegistry(oFunctions.discriminator(pe));
                const amp: number = 'amp' in pe && typeof pe.amp === 'number' ? pe.amp : 0;
                sd.max = Math.max(sd.max, amp);
                sd.min = Math.min(sd.min, amp);
                sd.sum += amp;
                ++sd.count;
            }
        });
    }
    let nAccumulator = 0,
        nMin = Infinity,
        nMax = -Infinity;
    aFilteredProperties.forEach((pe: Property) => {
        if ('amp' in pe) {
            if (typeof pe.amp === 'number') {
                nAccumulator += pe.amp;
                nMax = Math.max(nMax, pe.amp);
                nMin = Math.min(nMin, pe.amp);
            }
        }
    });
    return {
        sum: nAccumulator,
        max: nMax,
        min: nMin,
        count: aFilteredProperties.length,
        discriminator: oSorter,
    };
}

export function aggregateEffects(
    aWantedEffects: EffectType[],
    getters: GetterReturnType,
    oFunctions: AggregatorFunc<Effect>
): AggregatorAccumulator & { discriminator: Record<string, AggregatorAccumulator> } {
    const aTypeSet = new Set<EffectType>(aWantedEffects);
    const aFilteredEffects: Effect[] = getters.getEffects
        .filter(
            (eff: Effect): boolean =>
                aTypeSet.has(eff.type) && (oFunctions?.filter ? oFunctions.filter(eff) : true)
        )
        .map((eff: Effect): Effect => {
            if ('amp' in eff) {
                return {
                    ...eff,
                    amp: oFunctions?.ampMapper ? oFunctions.ampMapper(eff) : eff.amp,
                } as Effect;
            } else {
                return eff;
            }
        });
    if (oFunctions?.forEach) {
        // Applies a forEach function to all properties
        aFilteredEffects.forEach(oFunctions.forEach);
    }
    const oSorter: Record<string, AggregatorAccumulator> = {};
    const getDiscriminatorRegistry = (sDisc: string) => {
        if (!(sDisc in oSorter)) {
            oSorter[sDisc] = {
                sum: 0,
                min: Infinity,
                max: -Infinity,
                count: 0,
            };
        }
        return oSorter[sDisc];
    };
    if (typeof oFunctions?.discriminator === 'function') {
        aFilteredEffects.forEach((eff: Effect) => {
            if (typeof oFunctions?.discriminator === 'function') {
                const sd = getDiscriminatorRegistry(oFunctions.discriminator(eff));
                const amp: number = 'amp' in eff && typeof eff.amp === 'number' ? eff.amp : 0;
                sd.max = Math.max(sd.max, amp);
                sd.min = Math.min(sd.min, amp);
                sd.sum += amp;
                ++sd.count;
            }
        });
    }
    let nAccumulator = 0,
        nMin = Infinity,
        nMax = -Infinity;
    aFilteredEffects.forEach((pe: Property) => {
        if ('amp' in pe) {
            if (typeof pe.amp === 'number') {
                nAccumulator += pe.amp;
                nMax = Math.max(nMax, pe.amp);
                nMin = Math.min(nMin, pe.amp);
            }
        }
    });
    return {
        sum: nAccumulator,
        max: nMax,
        min: nMin,
        count: aFilteredEffects.length,
        discriminator: oSorter,
    };
}
