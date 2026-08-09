import type { GroupDoc, GroupMember, GroupRole } from "../models/Group"

export class GroupPermissionError extends Error {
    status: number

    constructor(message: string, status = 403) {
        super(message)
        this.status = status
        this.name = "GroupPermissionError"
    }
}

export function findMember(
    group: GroupDoc,
    userId: string
): GroupMember | undefined {
    return group.members.find((m) => m.user_id === userId)
}

export function assertGroupMember(group: GroupDoc, userId: string): GroupMember {
    const member = findMember(group, userId)
    if (!member) {
        throw new GroupPermissionError("You are not a member of this group")
    }
    return member
}

export function assertGroupAdmin(group: GroupDoc, userId: string): GroupMember {
    const member = assertGroupMember(group, userId)
    if (member.role !== "admin") {
        throw new GroupPermissionError("Admin access required")
    }
    return member
}

export function countAdmins(group: GroupDoc): number {
    return group.members.filter((m) => m.role === "admin").length
}

export function isLastAdmin(group: GroupDoc, userId: string): boolean {
    const member = findMember(group, userId)
    return member?.role === "admin" && countAdmins(group) === 1
}

export function canChangeRole(
    group: GroupDoc,
    targetUserId: string,
    newRole: GroupRole
): void {
    const target = findMember(group, targetUserId)
    if (!target) {
        throw new GroupPermissionError("User is not a member of this group", 404)
    }
    if (target.role === "admin" && newRole === "member" && isLastAdmin(group, targetUserId)) {
        throw new GroupPermissionError(
            "Cannot demote the last admin. Promote another member first."
        )
    }
}
