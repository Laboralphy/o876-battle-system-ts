/**
 * @class GroupMemberRegistry
 * @classDesc Registry to manage groups of members. This class manages one-to-many entities.
 */
export class GroupMemberRegistry {
    private readonly groups = new Map<string, Set<string>>();
    private readonly members = new Map<string, string>();

    /**
     * Retrieves the group ID of a specified member.
     * @param {string} idMember - The ID of the member.
     * @returns {string|undefined} The group ID of the member, or undefined if the member is not found.
     */
    getMemberGroup(idMember: string): string | undefined {
        return this.members.get(idMember);
    }

    /**
     * Sets the group of a specified member.
     * @param {string} idMember - The ID of the member.
     * @param {string} idGroup - The ID of the group to set for the member.
     */
    setMemberGroup(idMember: string, idGroup: string) {
        const idPrevGroup = this.getMemberGroup(idMember);
        if (idPrevGroup) {
            this.getGroupRegistry(idPrevGroup).delete(idMember);
        }
        this.getGroupRegistry(idGroup).add(idMember);
        this.members.set(idMember, idGroup);
    }

    /**
     * Retrieves all members located at a specified group.
     * @param {string} idGroup - The ID of the group.
     * @returns {Array<string>} An array of member IDs located at the specified group.
     */
    getGroupMembers(idGroup: string): string[] {
        if (this.groups.has(idGroup)) {
            return [...this.getGroupRegistry(idGroup)];
        } else {
            return [];
        }
    }

    /**
     * Retrieves the registry of members for a specified group.
     * If the group does not exist, it initializes it.
     * @param {string} idGroup - The ID of the group.
     * @returns {Set<string>} The set of member IDs located at the specified group.
     */
    getGroupRegistry(idGroup: string): Set<string> {
        if (!this.groups.has(idGroup)) {
            this.groups.set(idGroup, new Set<string>());
        }
        return this.groups.get(idGroup)!;
    }

    /**
     * Removes an member from the registry.
     * @param {string} idMember - The ID of the member to remove.
     */
    removeMember(idMember: string) {
        const idMemberGroup = this.getMemberGroup(idMember);
        if (idMemberGroup) {
            this.members.delete(idMember);
            this.getGroupRegistry(idMemberGroup).delete(idMember);
        }
    }

    /**
     * Removes a group, removes all members of this group.
     * @param idGroup {string}
     */
    removeGroup(idGroup: string) {
        for (const idMember of this.getGroupMembers(idGroup)) {
            this.removeMember(idMember);
        }
        this.groups.delete(idGroup);
    }
}
