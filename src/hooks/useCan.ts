import { AuthContext } from './../contexts/AuthContext';
// vai retornar se o usuário pode ou não pode fazer determinada coisa

import { useContext } from "react"
import { validateUserPermissions } from '../utils/validateUserPermissions';

type UseCanParams = {
  permissions?: string[];
  roles?: string[];
}

export function useCan({ permissions, roles }: UseCanParams) {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidPermissions = validateUserPermissions({
    user,
    permissions,
    roles
  });

  return userHasValidPermissions;
}