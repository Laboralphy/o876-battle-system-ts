import { ReactiveStore } from '@laboralphy/reactor';
import { State } from './store/state';
import { buildStore } from './store';

export class Creature {
    private readonly _store: ReactiveStore<State>;

    constructor() {
        this._store = buildStore();
    }

    get getters() {
        return this._store.getters;
    }
}
