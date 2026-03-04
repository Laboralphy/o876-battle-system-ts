import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { CONSTS } from '../../consts';
import CONDITIONS from '../../tables/conditions.json';
import { CapabilitySchema } from '../../schemas/enums/Capability';

const oConditionRegistry = new Map();
CONDITIONS.forEach(
    ({
        condition,
        description,
        prevents,
    }: {
        condition: string;
        description: string;
        prevents: string[];
    }) => {
        oConditionRegistry.set(condition, { description, prevents });
    }
);

const CAPABILITY_SET_ORIGIN = Object.keys(CONSTS).filter(
    (s: string): boolean => CapabilitySchema.safeParse(s).success
);

export function getCapabilitySet(state: State, getters: GetterReturnType): Set<string> {
    const aConditionSet = getters.getConditionSet;
    const aCapabilitySet = new Set(CAPABILITY_SET_ORIGIN);
    aConditionSet.forEach((sCondition) => {
        const r = oConditionRegistry.get(sCondition);
        if (r) {
            r.prevents.forEach((p: string) => {
                aCapabilitySet.delete(p);
            });
        }
    });
    return aCapabilitySet;
}
