// GroupMemberRegistry.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { GroupMemberRegistry } from '../src/GroupMemberRegistry'; // Assure-toi que le chemin est correct

describe('GroupMemberRegistry', () => {
    let registry: GroupMemberRegistry;

    beforeEach(() => {
        registry = new GroupMemberRegistry();
    });

    describe('getMemberGroup', () => {
        it('devrait retourner undefined pour un membre inexistant', () => {
            expect(registry.getMemberGroup('inconnu')).toBeUndefined();
        });

        it('devrait retourner le bon groupe pour un membre existant', () => {
            registry.setMemberGroup('membre1', 'groupe1');
            expect(registry.getMemberGroup('membre1')).toBe('groupe1');
        });
    });

    describe('setMemberGroup', () => {
        it('devrait ajouter un membre à un groupe', () => {
            registry.setMemberGroup('membre1', 'groupe1');
            expect(registry.getMemberGroup('membre1')).toBe('groupe1');
            expect(registry.getGroupMembers('groupe1')).toContain('membre1');
        });

        it('devrait déplacer un membre d’un groupe à un autre', () => {
            registry.setMemberGroup('membre1', 'groupe1');
            registry.setMemberGroup('membre1', 'groupe2');
            expect(registry.getMemberGroup('membre1')).toBe('groupe2');
            expect(registry.getGroupMembers('groupe1')).not.toContain('membre1');
            expect(registry.getGroupMembers('groupe2')).toContain('membre1');
        });
    });

    describe('getGroupMembers', () => {
        it('devrait retourner un tableau vide pour un groupe inexistant', () => {
            expect(registry.getGroupMembers('inconnu')).toEqual([]);
        });

        it('devrait retourner tous les membres d’un groupe', () => {
            registry.setMemberGroup('membre1', 'groupe1');
            registry.setMemberGroup('membre2', 'groupe1');
            expect(registry.getGroupMembers('groupe1')).toEqual(['membre1', 'membre2']);
        });
    });

    describe('removeMember', () => {
        it('devrait supprimer un membre du registre', () => {
            registry.setMemberGroup('membre1', 'groupe1');
            registry.removeMember('membre1');
            expect(registry.getMemberGroup('membre1')).toBeUndefined();
            expect(registry.getGroupMembers('groupe1')).not.toContain('membre1');
        });

        it('ne devrait rien faire si le membre n’existe pas', () => {
            registry.removeMember('inconnu');
            // Aucune erreur ne doit être levée
            expect(true).toBeTruthy();
        });
    });

    describe('removeGroup', () => {
        it('devrait supprimer un groupe et tous ses membres', () => {
            registry.setMemberGroup('membre1', 'groupe1');
            registry.setMemberGroup('membre2', 'groupe1');
            registry.removeGroup('groupe1');
            expect(registry.getGroupMembers('groupe1')).toEqual([]);
            expect(registry.getMemberGroup('membre1')).toBeUndefined();
            expect(registry.getMemberGroup('membre2')).toBeUndefined();
        });

        it('ne devrait rien faire si le groupe n’existe pas', () => {
            registry.removeGroup('inconnu');
            // Aucune erreur ne doit être levée
            expect(true).toBeTruthy();
        });
    });

    describe('Cas limites', () => {
        it('devrait gérer les chaînes vides comme identifiants', () => {
            registry.setMemberGroup('', 'groupe1');
            expect(registry.getMemberGroup('')).toBe('groupe1');
            expect(registry.getGroupMembers('groupe1')).toContain('');
        });

        it('devrait permettre à un membre d’être ajouté à un nouveau groupe après avoir été supprimé', () => {
            registry.setMemberGroup('membre1', 'groupe1');
            registry.removeMember('membre1');
            registry.setMemberGroup('membre1', 'groupe2');
            expect(registry.getMemberGroup('membre1')).toBe('groupe2');
            expect(registry.getGroupMembers('groupe2')).toContain('membre1');
        });
    });
});
