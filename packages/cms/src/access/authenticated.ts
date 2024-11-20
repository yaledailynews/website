import type { AccessArgs } from "payload";

import type { User } from "@cms/payload-types";

type isAuthenticated = (args: AccessArgs<User>) => boolean;

export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user);
};
