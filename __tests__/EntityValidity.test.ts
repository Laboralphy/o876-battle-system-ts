import { describe, expect, it } from 'vitest';
import { EntityFactory } from '../src/EntityFactory';
import { CONSTS } from '../src/consts';

describe('EntityValidity', () => {
    it('all entities should be valid', () => {
        const ef = new EntityFactory();
        ef.loadModules();
        for (const ref of ef.refs) {
            expect(() => {
                const et = ef.getAssetEntityType(ref);
                if (et === CONSTS.ENTITY_TYPE_CREATURE || et === CONSTS.ENTITY_TYPE_ITEM) {
                    try {
                        return ef.createEntity(ref);
                    } catch (e) {
                        console.error(`Failed to create entity ${ref}`);
                        console.error(e);
                        throw e;
                    }
                }
            }).not.toThrow();
        }
    });
});
