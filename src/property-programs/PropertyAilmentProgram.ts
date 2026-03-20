import { IPropertyProgram } from '../IPropertyProgram';
import { Property } from '../properties';
import { PropertyAilment } from '../properties/ailment';
import { CONSTS } from '../consts';
import { Attack } from '../Attack';
import z from 'zod';
import { Ability } from '../schemas/enums/Ability';
import { EffectDefinitionSchema } from '../effects';

type PropertyAilmentType = z.infer<typeof PropertyAilment>;

function isPropertyAilment(prop: object): prop is PropertyAilmentType {
    return 'type' in prop && prop.type === CONSTS.PROPERTY_AILMENT;
}

function isAttackHitSaveFail(attack: Attack, property: Property) {}

export class PropertyAilmentProgram implements IPropertyProgram {
    attack(property: Property, attack: Attack) {
        const attacker = attack.attacker;
        const target = attack.target;
        const attackerGetters = attacker.getters;
        const targetGetters = target.getters;
        if (isPropertyAilment(property)) {
            switch (property.ailment) {
                case CONSTS.AILMENT_ABILITY_DRAIN: {
                    // Apply ability drain if attack hits and saving throw success
                    if (attack.hit) {
                        // The DC is computed by using attacker's proficiency bonus
                        // and attacker's ability modifier
                        // the ability used is the ability involved in the attack
                        const sDefAbility: Ability = property.ability;
                        const sAtkAbility: Ability = attack.ability;
                        const dc =
                            attackerGetters.getDifficultyClass +
                            attackerGetters.getAbilityModifiers[sDefAbility];
                        // Saving throw
                        // The saving ability is specified in the property
                        const st = attack.target.rollSavingThrow(
                            sAtkAbility,
                            dc,
                            CONSTS.THREAT_TYPE_WITHERING
                        );
                        // If saving throw fails : apply effect ability modifier -amp
                        if (!st.success) {
                            const effectAbilityModifier = EffectDefinitionSchema.parse({
                                type: CONSTS.EFFECT_ABILITY_MODIFIER,
                                ability: property.ability,
                                amp: -property.amp,
                            });
                            attack.target.applyEffect(
                                effectAbilityModifier,
                                attacker,
                                property.duration,
                                property.subType
                            );
                        }
                    }
                    break;
                }

                case CONSTS.AILMENT_ATTACK_DRAIN: {
                    // Apply attack drain if attack hits and saving throw success
                    if (attack.hit) {
                        const sDefAbility: Ability = property.ability;
                        const sAtkAbility: Ability = attack.ability;
                        const dc =
                            attackerGetters.getDifficultyClass +
                            attackerGetters.getAbilityModifiers[sDefAbility];
                        // Saving throw
                        // The saving ability is specified in the property
                        const st = attack.target.rollSavingThrow(
                            sAtkAbility,
                            dc,
                            CONSTS.THREAT_TYPE_WITHERING
                        );
                        // If saving throw fails : apply effect ability modifier -amp
                        if (!st.success) {
                            const effectAbilityModifier = EffectDefinitionSchema.parse({
                                type: CONSTS.EFFECT_ABILITY_MODIFIER,
                                ability: property.ability,
                                amp: -property.amp,
                            });
                            attack.target.applyEffect(
                                effectAbilityModifier,
                                attacker,
                                property.duration,
                                property.subType
                            );
                        }
                    }
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
