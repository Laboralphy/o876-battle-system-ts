import { Creature } from "../src/Creature";

describe('Creature', () => {
    it('shoud instanciate with no error', () => {
        expect(() => new Creature()).not.toThrow();
    })
});
