import { Creature } from './Creature';
import { Property } from './properties';
import { Item } from './schemas/Item';
import { DamageType } from './schemas/enums/DamageType';
import { Attack } from './Attack';

export interface IPropertyProgram {
    /**
     * Called each turn
     */
    mutate?(property: Property, target: Creature, item: Item): void;

    /**
     * Called when target is attacked
     */
    attack?(property: Property, attack: Attack): void;

    /**
     * Called when you are attacked
     */
    attacked?(property: Property, attacker: Creature): void;

    /**
     * Called when you damage another creature
     */
    damage?(property: Property, amount: number, damageType: DamageType): void;

    /**
     * Called when you are damaged
     */
    damaged?(property: Property, amount: number, damageType: DamageType): void;
}
