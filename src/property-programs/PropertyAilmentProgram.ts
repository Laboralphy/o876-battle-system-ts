import { IPropertyProgram } from '../IPropertyProgram';
import { Property } from '../properties';
import { PropertyAilment } from '../properties/ailment';
import { Creature } from '../Creature';
import { CONSTS } from '../consts';
import { Attack } from '../Attack';
import z from 'zod';

type PropertyAilmentType = z.infer<typeof PropertyAilment>;

function isPropertyAilment(prop: object): prop is PropertyAilmentType {
    return 'type' in prop && prop.type === CONSTS.PROPERTY_AILMENT;
}

export class PropertyAilmentProgram implements IPropertyProgram {
    attack(property: Property, attack: Attack) {
        if (isPropertyAilment(property)) {
            switch (property.ailment) {
                case CONSTS.AILMENT_ABILITY_DRAIN: {
                    // Apply ability drain if attack hits and saving throw succes
                    if (attack.hit) {
                        //
                    }
                    break;
                }

                case CONSTS.AILMENT_ATTACK_DRAIN: {
                    break;
                }

                case CONSTS.AILMENT_ARMOR_CLASS_DRAIN: {
                    break;
                }

                case CONSTS.AILMENT_BLINDNESS: {
                    break;
                }

                case CONSTS.AILMENT_DISEASE: {
                    break;
                }

                case CONSTS.AILMENT_DOOM: {
                    break;
                }

                case CONSTS.AILMENT_FEAR: {
                    break;
                }

                case CONSTS.AILMENT_LEVEL_DRAIN: {
                    break;
                }

                case CONSTS.AILMENT_POISON: {
                    break;
                }

                case CONSTS.AILMENT_PARALYSIS: {
                    break;
                }

                case CONSTS.AILMENT_PETRIFICATION: {
                    break;
                }

                case CONSTS.AILMENT_SILENCE: {
                    break;
                }

                case CONSTS.AILMENT_SLOW: {
                    break;
                }

                case CONSTS.AILMENT_STUN: {
                    break;
                }

                default: {
                    break;
                }
            }
        }
    }
}
