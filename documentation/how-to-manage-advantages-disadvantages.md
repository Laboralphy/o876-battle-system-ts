# Combat System: Advantages & Disadvantages

## Overview

The combat system implements **Advantages** and **Disadvantages** for both **Attack Rolls** and **Saving Throws**, inspired by *Dungeons & Dragons 5th Edition*. These modifiers are categorized into four distinct types, each requiring a dedicated function to determine their applicability.

---

## Categories

1. **Attack Roll Advantages**
2. **Attack Roll Disadvantages**
3. **Saving Throw Advantages**
4. **Saving Throw Disadvantages**

Each category is implemented as a separate TypeScript file, containing functions that evaluate whether an advantage or disadvantage applies to a given `Attack` or `SavingThrowOutcome` instance.

---

## Implementation Guidelines

### 1. Function Structure

Each function must:

- **Return**: A boolean (`true` if the advantage/disadvantage applies, `false` otherwise).
- **Accept**: An instance of either:
    - `Attack` (for attack roll modifiers)
    - `SavingThrowOutcome` (for saving throw modifiers)

#### Function Signatures:

```typescript
// Attack Roll Advantages/Disadvantages
(attack: Attack) => boolean;

// Saving Throw Advantages/Disadvantages
(savingThrowOutcome: SavingThrowOutcome) => boolean;
```

### 2. File Organization

Functions must be placed in the appropriate file based on their category:

| Category                   | Folder Path                     |
| -------------------------- |---------------------------------|
| Attack Roll Advantages     | `src/adv-dis/attack-roll/adv/`  |
| Attack Roll Disadvantages  | `src/adv-dis/attack-roll/dis/`  |
| Saving Throw Advantages    | `src/adv-dis/saving-throw/adv/` |
| Saving Throw Disadvantages | `src/adv-dis/saving-throw/dis/` |

After implementing a new function, ensure it is exported in the corresponding index file for modular use (see next section).

### 3. Index File Updates

Index files are used to export functions from their respective folders.
Update the index file for each category as needed:

| Category                   | Index File Path                             |
| -------------------------- |---------------------------------------------|
| Attack Roll Advantages     | `src/adv-dis/attack-roll-advantages.ts`     |
| Attack Roll Disadvantages  | `src/adv-dis/attack-roll-disadvantages.ts`  |
| Saving Throw Advantages    | `src/adv-dis/saving-throw-advantages.ts`    |
| Saving Throw Disadvantages | `src/adv-dis/saving-throw-disadvantages.ts` |


---

## Example Implementation

### Attack Roll Advantage

```typescript
// src/adv-dis/attack-roll/adv/adv-attack-roll-target-disabled.ts
export function advAttackRollTargetDisabled(attack: Attack): boolean {
    return !attack.target.getters.getCapabilitySet.has(CONSTS.CAPABILITY_FIGHT);
}
```

### Saving Throw Disadvantage

```typescript
// src/adv-dis/saving-throw/dis/dis-saving-impeded-mobility.ts
export function disSavingThrowImpededMobility(savingThrowOutcome: SavingThrowOutcome): boolean {
    return (
        savingThrowOutcome.ability === CONSTS.ABILITY_DEXTERITY &&
        !savingThrowOutcome.creature.getters.getCapabilitySet.has(CONSTS.CAPABILITY_MOVE)
    );
}
```

---

## Best Practices

- **Clarity**: Name functions descriptively (e.g., `hasHighGroundAdvantage`).
- **Modularity**: Keep functions focused on a single condition.
- **Testing**: Validate edge cases (e.g., null/undefined inputs).

---

**Note**: This system is designed for extensibility. New advantages/disadvantages can be added by following the above structure.
