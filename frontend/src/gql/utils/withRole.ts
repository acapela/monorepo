import { Context } from "@apollo/client";
import { Role } from "~shared/roles";

export interface RequestWithRole {
  requestWithRole?: Role;
}

export function addRoleToContext(context?: Context, role?: Role) {
  return role
    ? {
        headers: {
          "x-hasura-role": role,
          ...(context?.headers ?? {}),
        },
        ...context,
      }
    : context;
}
