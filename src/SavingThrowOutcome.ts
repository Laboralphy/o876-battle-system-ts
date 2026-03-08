import { Ability } from './schemas/enums/Ability';
import { ThreatType } from './schemas/enums/ThreatType';
import { Advantage } from './schemas/enums/Advantage';
import { Disadvantage } from './schemas/enums/Disadvantage';
import { Creature } from './Creature';
import { CONSTS } from './consts';

export class SavingThrowOutcome {
    public roll: number = 0;
    public dc: number = 0;
    public success: boolean = false;
    public bonus: number = 0;
    public readonly advantages = new Set<Advantage>();
    public readonly disadvantages = new Set<Disadvantage>();

    constructor(
        public readonly creature: Creature,
        public readonly ability: Ability,
        public readonly threat: ThreatType = CONSTS.THREAT_TYPE_ANY
    ) {}
}
