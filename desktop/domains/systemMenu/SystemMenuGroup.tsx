import React, { ReactNode, createContext, useContext } from "react";

import { useConst } from "@aca/shared/hooks/useConst";
import { getUUID } from "@aca/shared/uuid";

interface Props {
  children: ReactNode;
}

const groupContext = createContext<string | null>(null);

export function SystemMenuGroup({ children }: Props) {
  const id = useConst(getUUID);

  return <groupContext.Provider value={id}>{children}</groupContext.Provider>;
}

export function useSystemMenuGroup() {
  return useContext(groupContext);
}
