import { DamageType } from './schemas/enums/DamageType';
import { Creature } from './Creature';
import { Item } from './schemas/Item';
import { CreatureVisibility } from './schemas/enums/CreatureVisibility';
import { CONSTS } from './consts';
import { Ability } from './schemas/enums/Ability';
import { Advantage } from './schemas/enums/Advantage';
import { Disadvantage } from './schemas/enums/Disadvantage';
import { AttackType } from './schemas/enums/AttackType';
import { randomUUID } from 'node:crypto';
import { DiceRoll } from './DiceRoll';

export type Damage = {
    amount: number;
    damageType: DamageType;
};

export class Attack {
    private _id = randomUUID();
    public readonly damages: Damage[] = []; // List of dealt damages with amount and type,
    public readonly diceRoll: DiceRoll = new DiceRoll('1d20');
    public attacker: Creature | null = null; // attacker creature reference
    public target: Creature | null = null; // target creature reference
    public weapon: Item | null = null; // weapon used
    public ammo: Item | null = null; // ammo used
    public ac: number = 0; // target armor class
    public distance: number = 0; // distance beetween attacker and target
    public range: number = 0; // maximum distance of attack (weapon)
    public sneak: boolean = false; // this was a sneak attack : damage will be doubled
    public opportunity: boolean = false; // this was an attack of opportunity
    public rush: boolean = false; // this was a rushed attack
    public improvised: boolean = false; // this was an attack done with an improvised weapon
    public fumble: boolean = false; // roll was 1 : automatic fail
    public critical: boolean = false; // roll was over critical range : automatic hit
    public hit: boolean = false; // if true attack has hit
    public visibility: CreatureVisibility = CONSTS.CREATURE_VISIBILITY_VISIBLE; // Target visibility
    public ability: Ability = CONSTS.ABILITY_STRENGTH; // ability used in attack
    public readonly advantages: Set<Advantage> = new Set<Advantage>(); // list of advantages
    public readonly disadvantages: Set<Disadvantage> = new Set<Disadvantage>(); // list of disadvantages
    public cancelAdvantage: boolean = false; // when true all advantages are cancelled
    public cancelDisadvantage: boolean = false; // when true all disadvantages are cancelled
    public attackType: AttackType = CONSTS.ATTACK_TYPE_ANY; // attack type (ranged, melee)
    // action ?  // action used in the attack
    public lethal: boolean = false; // true when the target is killed during the attack
    public failed: boolean = false; // The attack failed
    public failure: string = ''; //

    get id() {
        return this._id;
    }

    set attackBonus(value: number) {
        this.diceRoll.modifier = value;
    }

    get attackBonus(): number {
        return this.diceRoll.modifier;
    }

    get roll(): number {
        return this.diceRoll.roll;
    }

    addAdvantage(advantage: Advantage): void {
        this.advantages.add(advantage);
        this.diceRoll.advantage = true;
    }

    get advantage() {
        return !this.cancelAdvantage && this.advantages.size > 0;
    }

    addDisadvantage(disadvantage: Disadvantage): void {
        this.disadvantages.add(disadvantage);
        this.diceRoll.disadvantage = true;
    }

    get disadvantage() {
        return !this.cancelDisadvantage && this.disadvantages.size > 0;
    }
}
