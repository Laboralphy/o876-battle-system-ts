import { describe, expect, it } from 'vitest';
import { EntityManager } from '../src/EntityManager';
import { CONSTS } from '../src/consts';
import z from 'zod';

describe('EntityValidity', () => {
    it('all entities should be valid', () => {
        const ef = new EntityManager();
        const itemRefs = ef.refs.filter(
            (ref) => ef.getAssetEntityType(ref) === CONSTS.ENTITY_TYPE_ITEM
        );
        const creatureRefs = ef.refs.filter(
            (ref) => ef.getAssetEntityType(ref) === CONSTS.ENTITY_TYPE_CREATURE
        );
        type ErrorEntry = { ref: string; error: z.ZodError };
        const invalidItems: ErrorEntry[] = [];
        for (const ref of itemRefs) {
            try {
                ef.createItem(ref);
            } catch (e) {
                invalidItems.push({
                    ref: ref,
                    error: e as z.ZodError,
                });
            }
        }
        const invalidCreatures: ErrorEntry[] = [];
        for (const ref of creatureRefs) {
            try {
                ef.createCreature(ref);
            } catch (e) {
                invalidCreatures.push({
                    ref: ref,
                    error: e as z.ZodError,
                });
            }
        }
        expect(invalidItems).toEqual([]);
        expect(invalidCreatures).toEqual([]);
    });
});
