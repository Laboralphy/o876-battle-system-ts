import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { aggregate } from '../../libs/aggregator';
import { CONSTS } from '../../consts';

export function getLevel(state: State, getters: GetterReturnType) {
    return Math.max(1, state.level - aggregate([CONSTS.EFFECT_NEGATIVE_LEVEL], {}, getters).sum);
}
