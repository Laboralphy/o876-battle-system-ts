import { deepMerge } from '../src/libs/deep-merge'; // Ajuste le chemin selon ton projet
import { deepClone } from '../src/libs/deep-clone';
import { describe, expect, it } from 'vitest'; // Assure-toi que deepClone est correctement importé

describe('deepMerge', () => {
    // Test 1 : Fusion de deux objets simples
    it('should merge two simple objects', () => {
        const target = { a: 1, b: 2 };
        const source = { b: 3, c: 4 };
        const result = deepMerge(target, source);
        expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    // Test 2 : Fusion d'objets imbriqués
    it('should merge nested objects', () => {
        const target = { a: 1, nested: { b: 2, c: 3 } };
        const source = { a: 5, nested: { c: 4, d: 6 } };
        const result = deepMerge(target, source);
        expect(result).toEqual({ a: 5, nested: { b: 2, c: 4, d: 6 } });
    });

    // Test 3 : Fusion de tableaux (remplacement complet)
    it('should replace arrays with a deep copy', () => {
        const target = { a: [1, 2], b: 3 };
        const source = { a: [3, 4, 5], c: 6 };
        const result = deepMerge(target, source);
        expect(result).toEqual({ a: [3, 4, 5], b: 3, c: 6 });
        // Vérifie que le tableau est bien cloné
        expect(result.a).not.toBe(source.a);
    });

    // Test 4 : Ajout de nouvelles propriétés
    it('should add new properties from source', () => {
        const target = { a: 1 };
        const source = { b: 2, c: { d: 3 } };
        const result = deepMerge(target, source);
        expect(result).toEqual({ a: 1, b: 2, c: { d: 3 } });
    });

    // Test 5 : Gestion des références circulaires (doit lever une erreur)
    it('should throw an error on circular references', () => {
        const target = { a: 1 };
        const source: any = { b: 2 };
        source.self = source; // Référence circulaire
        expect(() => deepMerge(target, source)).toThrow('ERR_MERGE_RECURSIVE');
    });

    // Test 6 : Types incompatibles (écrasement)
    it('should overwrite incompatible types', () => {
        const target = { a: 1, b: { c: 2 } };
        const source = { a: 'hello', b: 3 };
        const result = deepMerge(target, source);
        expect(result).toEqual({ a: 'hello', b: 3 });
    });

    // Test 7 : Fusion avec un objet vide
    it('should return target if source is empty', () => {
        const target = { a: 1, b: 2 };
        const source = {};
        const result = deepMerge(target, source);
        expect(result).toEqual({ a: 1, b: 2 });
    });

    // Test 8 : Fusion avec un objet non-objet (doit retourner une copie de source)
    it('should return a copy of source if target is not an object', () => {
        const target = null as any;
        const source = { a: 1 };
        const result = deepMerge(target, source);
        expect(result).toEqual({ a: 1 });
    });

    // Test 9 : Fusion avec des valeurs primitives
    it('should handle primitive values', () => {
        const target = { a: 1, b: 'hello' };
        const source = { b: 'world', c: true };
        const result = deepMerge(target, source);
        expect(result).toEqual({ a: 1, b: 'world', c: true });
    });

    // Test 10 : Vérification de l'immuabilité des objets sources
    it('should not modify source objects', () => {
        const target = { a: 1, nested: { b: 2 } };
        const source = { nested: { c: 3 } };
        const sourceClone = deepClone(source);
        deepMerge(target, source);
        expect(source).toEqual(sourceClone); // source ne doit pas être modifié
    });

    // Test 11 : Fusion profonde avec plusieurs niveaux d'imbrication
    it('should deeply merge objects with multiple levels', () => {
        const target = { a: { b: { c: 1, d: 2 } } };
        const source = { a: { b: { d: 3, e: 4 }, f: 5 } };
        const result = deepMerge(target, source);
        expect(result).toEqual({ a: { b: { c: 1, d: 3, e: 4 }, f: 5 } });
    });

    // Test 12 : Fusion avec des tableaux imbriqués
    it('should handle nested arrays', () => {
        const target = { a: [1, { b: 2 }] };
        const source = { a: [3, { c: 4 }] };
        const result = deepMerge(target, source);
        expect(result).toEqual({ a: [3, { c: 4 }] });
        // Vérifie que les objets dans les tableaux sont bien clonés
        expect(result.a[1]).not.toBe(source.a[1]);
    });

    // Test 13 : Fusion avec des propriétés manquantes dans target
    it('should add missing properties from source', () => {
        const target = { a: 1 };
        const source = { b: { c: 2 } };
        const result = deepMerge(target, source);
        expect(result).toEqual({ a: 1, b: { c: 2 } });
    });

    // Test 14 : Typage générique (vérification des types)
    it('should preserve generic types', () => {
        interface Target {
            a: number;
            b?: { c: string };
        }
        interface Source {
            b: { c: string; d: boolean };
        }
        const target: Target = { a: 1 };
        const source: Source = { b: { c: 'hello', d: true } };
        const result: Target & Source = deepMerge(target, source);
        expect(result.a).toBe(1);
        expect(result.b?.c).toBe('hello');
        expect(result.b?.d).toBe(true);
    });
});

describe('deepMerge - Isolation des copies', () => {
    // Test 15 : Vérifie que la modification de `source` après fusion n'affecte pas le résultat
    it('should not be affected by changes to source after merge', () => {
        const target = { a: 1, nested: { b: 2 } };
        const source = { nested: { c: 3 }, d: 4 };
        const result = deepMerge(target, source);

        // Modifie `source` après la fusion
        source.nested.c = 999;
        source.d = 888;

        // Le résultat ne doit pas être affecté
        expect(result.nested.c).toBe(3);
        expect(result.d).toBe(4);
    });

    // Test 16 : Vérifie que la modification de `target` après fusion n'affecte pas le résultat
    it('should not be affected by changes to target after merge', () => {
        const target = { a: 1, nested: { b: 2 } };
        const source = { nested: { c: 3 } };
        const result = deepMerge(target, source);

        // Modifie `target` après la fusion
        target.nested.b = 999;

        // Le résultat ne doit pas être affecté (sauf si `target` est modifié avant la fusion)
        expect(result.nested.b).toBe(2); // Doit rester la valeur originale de `target`
    });

    // Test 17 : Vérifie que les tableaux sont bien clonés
    it('should clone arrays deeply', () => {
        const target = { a: [1, 2, { x: 10 }] };
        const source: { a: [number, number, { y: number }] } = { a: [3, 4, { y: 20 }] };
        const result = deepMerge(target, source);

        // Modifie le tableau dans `source`
        source.a[0] = 999;
        source.a[2].y = 999;

        // Le résultat ne doit pas être affecté
        expect(result.a[0]).toBe(3);
        expect(result.a[2].y).toBe(20);
    });

    // Test 18 : Vérifie que les objets imbriqués sont bien clonés
    it('should clone nested objects deeply', () => {
        const target = { a: { b: { c: 1 } } };
        const source = { a: { b: { d: 2 } } };
        const result = deepMerge(target, source);

        // Modifie l'objet imbriqué dans `source`
        source.a.b.d = 999;

        // Le résultat ne doit pas être affecté
        expect(result.a.b.d).toBe(2);
    });

    // Test 19 : Vérifie que le résultat est un nouvel objet
    it('should return a new object', () => {
        const target = { a: 1 };
        const source = { b: 2 };
        const result = deepMerge(target, source);

        // Le résultat doit être différent de `target` et `source`
        expect(result).not.toBe(target);
        expect(result).not.toBe(source);
    });
});
