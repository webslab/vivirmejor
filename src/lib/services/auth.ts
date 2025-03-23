import { getAuthService, type IAuthService } from "@webslab/shared/services";

import { DB } from "$lib/consts.ts";

export type { IAuthService };
export const authService = getAuthService(DB);
