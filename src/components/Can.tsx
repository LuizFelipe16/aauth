// verificar se o usuário pode fazer alguma coisa

import { ReactNode } from "react";
import { useCan } from "../hooks/useCan";

interface CanProps {
  children: ReactNode;

  permissions?: string[];
  roles?: string[];
}

export function Can({ children, permissions, roles }: CanProps) {
  const isUserCanSeeComponent = useCan({
    permissions,
    roles
  });

  if (!isUserCanSeeComponent) {
    return null;
  }

  return (
    <>
      {children}
    </>
  );
}