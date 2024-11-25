import { getAuthService } from "@webslab/shared/services";
import { DB } from "./consts.ts";

export const authService = getAuthService(DB);
// ;(async () => {
// 	console.log('ready:', await authService.isReady)
// 	console.log('signin:', await authService.signin('test', 'test'))
// 	console.log('signup:', authService.isAuthenticated())
// })()
