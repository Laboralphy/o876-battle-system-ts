import { Creature } from '../Creature';
import { IPropertyProgram } from '../IPropertyProgram';
import { Property } from '../properties';
import { Item } from '../schemas/Item';

export class PropertyProgramRegeneration implements IPropertyProgram {
    mutate(property: Property, target: Creature, item: Item) {
        // do nothing for the moement, this is a place holder.
    }
}
