import { Horde } from './Horde';
import { Effect } from './effects';

export class Manager {
    private _time: number = 0;
    private readonly _horde = new Horde();

    process() {
        ++this._time;
    }

    /**
     * Will remove dead effects (effects with duration <= 0 && depletionDelay <= 0)
     */
    processActiveCreatures() {
        this._horde.activeCreatures.forEach((creature) => {
            creature.depleteEffects();
            // play regeneration
        });
    }
}
