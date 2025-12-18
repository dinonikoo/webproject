import { GlobalRole, BoardRole } from '@prisma/client';

export const isGlobalAdmin = (user: { role: GlobalRole }) =>
  user.role === GlobalRole.ADMIN;

export const canManageBoard = (
  user: { role: GlobalRole },
  boardRole?: BoardRole
) =>
  isGlobalAdmin(user) || boardRole === BoardRole.ADMIN;

export const canCreateOrDeleteTasks = (
  user: { role: GlobalRole },
  boardRole?: BoardRole
) =>
  isGlobalAdmin(user) || boardRole === BoardRole.ADMIN;

export const canMoveStatus = (
  user: { role: GlobalRole },
  boardRole?: BoardRole
) =>
  isGlobalAdmin(user) ||
  boardRole === BoardRole.ADMIN ||
  boardRole === BoardRole.EDITOR;

export const canViewBoard = (
  user: { role: GlobalRole },
  isMember: boolean
) =>
  isGlobalAdmin(user) || isMember;
