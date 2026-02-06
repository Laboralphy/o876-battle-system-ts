import { Item, ItemBlueprint, ItemBlueprintSchema } from './schemas/Item';
import { deepClone } from './libs/deep-clone';
import crypto from 'node:crypto';
import { Creature } from './Creature';
import { CreatureBlueprint, CreatureBlueprintSchema } from './schemas/CreatureBlueprint';
import { ExtendableEntity, ExtendResolver } from './ExtendResolver';

export class EntityFactory {
    private readonly itemBlueprints = new Map<string, ItemBlueprint>();
    private readonly creatureBlueprints = new Map<string, CreatureBlueprint>();
    private readonly extendResolver = new ExtendResolver();

    declareBlueprint(ref: string, blueprint: ExtendableEntity): void {
        this.extendResolver.declareEntity(ref, blueprint);
    }

    createItem(ref: string, id: string = ''): Item {
        const bp = this.itemBlueprints.get(ref);
        if (!bp) {
            throw new Error(`Item blueprint ${ref} not found`);
        }
        return { ...deepClone(bp), ref, id: id.length > 0 ? id : crypto.randomUUID() };
    }

    createItemFromBlueprint(blueprint: ItemBlueprint, id: string = ''): Item {
        return { ...deepClone(blueprint), ref: '', id: id.length > 0 ? id : crypto.randomUUID() };
    }

    createCreature(ref: string, id: string = ''): Creature {
        let bpCreature = this.creatureBlueprints.get(ref);
        if (!bpCreature) {
            // Creature has not been created yet
            bpCreature = CreatureBlueprintSchema.parse(this.extendResolver.resolveEntity(ref));
            this.creatureBlueprints.set(ref, bpCreature);
        }
        // Replace all string equipment by real item blueprint
        bpCreature.equipment = bpCreature.equipment.map((eq) => {
            if (typeof eq === 'string') {
                return ItemBlueprintSchema.parse(this.extendResolver.resolveEntity(eq));
            } else {
                return eq;
            }
        });
        const creature = new Creature(id);
        // specie and race
        creature.state.specie = bpCreature.specie;
        creature.state.race = bpCreature.race ?? '';
        // abilities
        creature.state.abilities.strength = bpCreature.abilities.strength;
        creature.state.abilities.dexterity = bpCreature.abilities.dexterity;
        creature.state.abilities.constitution = bpCreature.abilities.constitution;
        creature.state.abilities.intelligence = bpCreature.abilities.intelligence;
        creature.state.abilities.wisdom = bpCreature.abilities.wisdom;
        creature.state.abilities.charisma = bpCreature.abilities.charisma;

        creature.state.level = bpCreature.level;
        creature.state.hitDie = bpCreature.hitDie;
        creature.state.armorClass = bpCreature.armorClass;
        creature.state.speed = bpCreature.speed;
        creature.state.hitPoints = 1;

        // Innate Properties
        bpCreature.properties.forEach((property) => creature.addInnateProperty(property));
        creature.state.proficiencies.push(...bpCreature.proficiencies);

        bpCreature.equipment.forEach((eq) => {
            const item: Item =
                typeof eq === 'string' ? this.createItem(eq) : this.createItemFromBlueprint(eq);
            creature.equipItem(item);
        });

        return creature;
    }

    createEntity(ref: string, id: string = ''): Item | Creature {
        if (this.itemBlueprints.has(ref)) {
            return this.createItem(ref, id);
        }
        const bpCreature = this.creatureBlueprints.get(ref);
        if (bpCreature) {
            return new Creature();
        }
        throw new Error(`Entity blueprint ${ref} not found`);
    }
}
