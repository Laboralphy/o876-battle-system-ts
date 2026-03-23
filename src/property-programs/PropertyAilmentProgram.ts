import { IPropertyProgram } from '../IPropertyProgram';
import { Property } from '../properties';
import { PropertyAilment } from '../properties/ailment';
import { CONSTS } from '../consts';
import { Attack } from '../Attack';
import z from 'zod';
import { Ability } from '../schemas/enums/Ability';
import { EffectDefinitionSchema } from '../effects';
import { ThreatType } from '../schemas/enums/ThreatType';

type PropertyAilmentType = z.infer<typeof PropertyAilment>;

function isPropertyAilment(prop: object): prop is PropertyAilmentType {
    return 'type' in prop && prop.type === CONSTS.PROPERTY_AILMENT;
}

/**
 * This is a macro.
 * Returns true if the specified attack hits and the saving throw fails.
 * That means that the target is affected by the ailment.
 *
 * @param attack
 * @param property
 * @param sThreat
 */
function isAttackHitSaveFail(attack: Attack, property: Property, sThreat: ThreatType) {
    // The DC is computed by using attacker's proficiency bonus
    // and attacker's ability modifier
    // the ability used is the ability involved in the attack
    if (!isPropertyAilment(property)) {
        return;
    }
    const attacker = attack.attacker;
    const target = attack.target;
    const attackerGetters = attacker.getters;
    const sDefAbility: Ability = property.ability;
    const sAtkAbility: Ability = attack.ability;
    const dc =
        attackerGetters.getDifficultyClass + attackerGetters.getAbilityModifiers[sDefAbility];
    // Saving throw
    // The saving ability is specified in the property
    const st = target.rollSavingThrow(sAtkAbility, dc, sThreat);
    // If saving throw fails : apply effect ability modifier -amp
    return !st.success;
}

export class PropertyAilmentProgram implements IPropertyProgram {
    attack(property: Property, attack: Attack) {
        if (isPropertyAilment(property)) {
            switch (property.ailment) {
                case CONSTS.AILMENT_ABILITY_DRAIN: {
                    // Apply ability drain if attack hits and saving throw success
                    if (isAttackHitSaveFail(attack, property, CONSTS.THREAT_TYPE_WITHERING)) {
                        const effectAilment = EffectDefinitionSchema.parse({
                            type: CONSTS.EFFECT_ABILITY_MODIFIER,
                            ability: property.ability,
                            amp: -property.amp,
                        });
                        attack.target.applyEffect(
                            effectAilment,
                            attack.attacker,
                            property.duration,
                            property.subType
                        );
                    }
                    break;
                }

                case CONSTS.AILMENT_ATTACK_DRAIN: {
                    // Apply attack drain if attack hits and saving throw success
                    if (isAttackHitSaveFail(attack, property, CONSTS.THREAT_TYPE_WITHERING)) {
                        const effectAilment = EffectDefinitionSchema.parse({
                            type: CONSTS.EFFECT_ABILITY_MODIFIER,
                            ability: property.ability,
                            amp: -property.amp,
                        });
                        attack.target.applyEffect(
                            effectAilment,
                            attack.attacker,
                            property.duration,
                            property.subType
                        );
                    }
                    break;
                }

                case CONSTS.AILMENT_ARMOR_CLASS_DRAIN: {
                    if (isAttackHitSaveFail(attack, property, CONSTS.THREAT_TYPE_WITHERING)) {
                        const effectAilment = EffectDefinitionSchema.parse({
                            type: CONSTS.EFFECT_ARMOR_CLASS_MODIFIER,
                            ability: property.ability,
                            amp: -property.amp,
                        });
                        attack.target.applyEffect(
                            effectAilment,
                            attack.attacker,
                            property.duration,
                            property.subType
                        );
                    }
                    break;
                }

                case CONSTS.AILMENT_BLINDNESS: {
                    if (isAttackHitSaveFail(attack, property, CONSTS.THREAT_TYPE_DISEASE)) {
                        const effectAilment = EffectDefinitionSchema.parse({
                            type: CONSTS.EFFECT_BLINDNESS,
                        });
                        attack.target.applyEffect(
                            effectAilment,
                            attack.attacker,
                            property.duration,
                            property.subType
                        );
                    }
                    break;
                }

                case CONSTS.AILMENT_DISEASE: {
                    // Will inflict the specified disease
                    if (isAttackHitSaveFail(attack, property, CONSTS.THREAT_TYPE_DISEASE)) {
                        const effectAilment = EffectDefinitionSchema.parse({
                            type: CONSTS.EFFECT_DISEASE,
                            disease: property.disease,
                        });
                        attack.target.applyEffect(
                            effectAilment,
                            attack.attacker,
                            property.duration,
                            property.subType
                        );
                    }
                    break;
                }

                case CONSTS.AILMENT_DOOM: {
                    if (isAttackHitSaveFail(attack, property, CONSTS.THREAT_TYPE_SPELL)) {
                        const effectAilment1 = EffectDefinitionSchema.parse({
                            type: CONSTS.EFFECT_DISADVANTAGE_ATTACK,
                        });
                        const effectAilment2 = EffectDefinitionSchema.parse({
                            type: CONSTS.EFFECT_DISADVANTAGE_SAVING_THROW,
                        });
                        attack.target.applyEffectGroup(
                            [effectAilment1, effectAilment2],
                            attack.attacker,
                            property.duration,
                            property.subType
                        );
                    }
                    break;
                }

                case CONSTS.AILMENT_FEAR: {
                    if (isAttackHitSaveFail(attack, property, CONSTS.THREAT_TYPE_FEAR)) {
                        const effectAilment = EffectDefinitionSchema.parse({
                            type: CONSTS.EFFECT_FEAR,
                        });
                        attack.target.applyEffect(
                            effectAilment,
                            attack.attacker,
                            property.duration,
                            property.subType
                        );
                    }
                    break;
                }

                case CONSTS.AILMENT_LEVEL_DRAIN: {
                    if (isAttackHitSaveFail(attack, property, CONSTS.THREAT_TYPE_WITHERING)) {
                        const effectAilment = EffectDefinitionSchema.parse({
                            type: CONSTS.EFFECT_NEGATIVE_LEVEL,
                            amp: property.amp,
                        });
                        attack.target.applyEffect(
                            effectAilment,
                            attack.attacker,
                            property.duration,
                            property.subType
                        );
                    }
                    break;
                }

                case CONSTS.AILMENT_POISON: {
                    if (isAttackHitSaveFail(attack, property, CONSTS.THREAT_TYPE_POISON)) {
                        const effectAilment = EffectDefinitionSchema.parse({
                            type: CONSTS.EFFECT_DAMAGE,
                            amp: property.amp,
                            damageType: CONSTS.DAMAGE_TYPE_POISON,
                        });
                        attack.target.applyEffect(
                            effectAilment,
                            attack.attacker,
                            property.duration,
                            property.subType
                        );
                    }
                    break;
                }

                case CONSTS.AILMENT_PARALYSIS: {
                    if (isAttackHitSaveFail(attack, property, CONSTS.THREAT_TYPE_PARALYSIS)) {
                        const effectAilment = EffectDefinitionSchema.parse({
                            type: CONSTS.EFFECT_PARALYSIS,
                        });
                        attack.target.applyEffect(
                            effectAilment,
                            attack.attacker,
                            property.duration,
                            property.subType
                        );
                    }
                    break;
                }

                case CONSTS.AILMENT_PETRIFICATION: {
                    if (isAttackHitSaveFail(attack, property, CONSTS.THREAT_TYPE_PETRIFICATION)) {
                        const effectAilment = EffectDefinitionSchema.parse({
                            type: CONSTS.EFFECT_PETRIFICATION,
                        });
                        attack.target.applyEffect(
                            effectAilment,
                            attack.attacker,
                            property.duration,
                            property.subType
                        );
                    }
                    break;
                }

                case CONSTS.AILMENT_SLOW: {
                    if (isAttackHitSaveFail(attack, property, CONSTS.THREAT_TYPE_ANY)) {
                        const effectAilment = EffectDefinitionSchema.parse({
                            type: CONSTS.EFFECT_PETRIFICATION,
                        });
                        attack.target.applyEffect(
                            effectAilment,
                            attack.attacker,
                            property.duration,
                            property.subType
                        );
                    }
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
