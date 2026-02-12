import { Creature } from './Creature';
import { Property } from './properties';
import { Item } from './schemas/Item';

export interface IPropertyProgram {
    /**
     * Called each turn
     */
    mutate?(property: Property, target: Creature, item: Item): void;
}
