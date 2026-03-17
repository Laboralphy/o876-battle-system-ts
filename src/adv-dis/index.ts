import { Attack } from '../Attack';
import { Advantage } from '../schemas/enums/Advantage';
import { SavingThrowOutcome } from '../SavingThrowOutcome';
import { ATTACK_ROLL_ADVANTAGES } from './attack-roll-advantages';
import { ATTACK_ROLL_DISADVANTAGES } from './attack-roll-disadvantages';
import { SAVING_THROW_DISADVANTAGES } from './saving-throw-disadvantages';
import { SAVING_THROW_ADVANTAGES } from './saving-throw-advantages';

export function computeAttackRollAdvantages(attack: Attack) {
    const adv = new Set<Advantage>();
    for (const [advantage, f] of Object.entries(ATTACK_ROLL_ADVANTAGES)) {
        if (f(attack)) {
            adv.add(advantage);
        }
    }
    const dis = new Set<Advantage>();
    for (const [disadvantage, f] of Object.entries(ATTACK_ROLL_DISADVANTAGES)) {
        if (f(attack)) {
            dis.add(disadvantage);
        }
    }
    return {
        advantages: adv,
        disadvantages: dis,
    };
}

export function computeSavingThrowAdvantages(savingThrowOutcome: SavingThrowOutcome) {
    const adv = new Set<Advantage>();
    for (const [advantage, f] of Object.entries(SAVING_THROW_ADVANTAGES)) {
        if (f(savingThrowOutcome)) {
            adv.add(advantage);
        }
    }
    const dis = new Set<Advantage>();
    for (const [disadvantage, f] of Object.entries(SAVING_THROW_DISADVANTAGES)) {
        if (f(savingThrowOutcome)) {
            dis.add(disadvantage);
        }
    }
    return {
        advantages: adv,
        disadvantages: dis,
    };
}
