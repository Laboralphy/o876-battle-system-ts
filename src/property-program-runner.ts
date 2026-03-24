import { Property } from './properties';
import { Attack } from './Attack';
import { PropertyPrograms } from './property-programs';

function getProgramKey(sPropertyType: string): string {
    return 'PROPERTY_PROGRAM_' + sPropertyType.replace(/^PROPERTY_/, '');
}

export function propertyHasProgram(sPropertyType: string): boolean {
    return getProgramKey(sPropertyType) in PropertyPrograms;
}

export function propertyRunProgramAttack(property: Property, attack: Attack) {
    const ppr = PropertyPrograms[getProgramKey(property.type)];
    if (ppr && ppr.attack) {
        ppr.attack(property, attack);
    }
}
