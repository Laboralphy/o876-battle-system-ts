import { Property } from '../../properties';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';
import { PropertyType, PropertyTypeSchema } from '../../schemas/enums/PropertyType';
import { EffectType, EffectTypeSchema } from '../../schemas/enums/EffectType';
import { Effect } from '../../effects';
import { GetterReturnType } from '../../store/define-getters';

export interface AggregatorFunc<T extends Property | Effect> {
    filter?(pe: T): boolean;
    ampMapper?(pe: T): number;
    discriminator?(pe: T): string;
    forEach?(pe: T): void;
}

export type PropertyAggregatorOptions = {
    excludeInnate?: boolean;
    restrictSlots?: EquipmentSlot[];
};

export type AggregatorAccumulator = {
    sum: number;
    max: number;
    min: number;
    count: number;
};

export type Discriminator = Record<string, AggregatorAccumulator>;

export type AggregatorResult = AggregatorAccumulator & {
    discriminator: Discriminator;
};

function getDiscriminatorRegistry(oSorter: Discriminator, sKey: string) {
    if (!(sKey in oSorter)) {
        oSorter[sKey] = {
            sum: 0,
            min: Infinity,
            max: -Infinity,
            count: 0,
        };
    }
    return oSorter[sKey];
}

export function aggregateProperties(
    aWantedProperties: PropertyType[],
    getters: GetterReturnType,
    oFunctions: AggregatorFunc<Property>,
    options: PropertyAggregatorOptions
): AggregatorResult {
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
    const oDiscriminator: Record<string, AggregatorAccumulator> = {};
    if (typeof oFunctions?.discriminator === 'function') {
        aFilteredProperties.forEach((pe: Property) => {
            if (typeof oFunctions?.discriminator === 'function') {
                const sd = getDiscriminatorRegistry(oDiscriminator, oFunctions.discriminator(pe));
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
        discriminator: oDiscriminator,
    };
}

export function aggregateEffects(
    aWantedEffects: EffectType[],
    getters: GetterReturnType,
    oFunctions: AggregatorFunc<Effect>
): AggregatorResult {
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
    const oDiscriminator: Record<string, AggregatorAccumulator> = {};
    if (typeof oFunctions?.discriminator === 'function') {
        aFilteredEffects.forEach((eff: Effect) => {
            if (typeof oFunctions?.discriminator === 'function') {
                const sd = getDiscriminatorRegistry(oDiscriminator, oFunctions.discriminator(eff));
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
    aFilteredEffects.forEach((eff: Effect) => {
        if ('amp' in eff) {
            if (typeof eff.amp === 'number') {
                nAccumulator += eff.amp;
                nMax = Math.max(nMax, eff.amp);
                nMin = Math.min(nMin, eff.amp);
            }
        }
    });
    return {
        sum: nAccumulator,
        max: nMax,
        min: nMin,
        count: aFilteredEffects.length,
        discriminator: oDiscriminator,
    };
}

export function mergeAccumulators(
    a1: AggregatorAccumulator,
    a2: AggregatorAccumulator
): AggregatorAccumulator {
    a1.sum += a2.sum;
    a1.min = Math.min(a1.min, a2.min);
    a1.max = Math.max(a1.max, a2.max);
    a1.count += a2.count;
    return a1;
}

export function mergeResults(a1: AggregatorResult, a2: AggregatorResult) {
    const discriminator: Discriminator = a1.discriminator;
    for (const [name, value] of Object.entries(a2.discriminator)) {
        if (name in discriminator) {
            discriminator[name] = mergeAccumulators(discriminator[name], value);
        } else {
            discriminator[name] = value;
        }
    }
    mergeAccumulators(a1, a2);
    a1.discriminator = discriminator;
    return a1;
}

export type AggregateOptions = {
    effects?: AggregatorFunc<Effect>;
    properties?: AggregatorFunc<Property>;
    excludeInnate?: boolean;
    restrictSlots?: EquipmentSlot[];
};

export function aggregate(
    types: (EffectType | PropertyType)[],
    options: AggregateOptions,
    getters: GetterReturnType
): AggregatorResult {
    const effTypes = types.filter((t) => EffectTypeSchema.safeParse(t).success);
    const propTypes = types.filter((t) => PropertyTypeSchema.safeParse(t).success);
    const propOptions = {
        excludeInnate: options.excludeInnate ?? false,
        restrictSlots: options.restrictSlots ?? [],
    };

    return mergeResults(
        aggregateEffects(effTypes, getters, options.effects ?? {}),
        aggregateProperties(propTypes, getters, options.properties ?? {}, propOptions)
    );
}
