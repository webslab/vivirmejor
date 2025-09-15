import { authService, type IAuthService } from "$lib/services/auth.ts";

export function waitElement<T extends Element>(selector: string): Promise<T> {
	return new Promise((resolve, _reject) => {
		const intervalId = setInterval(() => {
			const el = document.querySelector(selector);

			if (el) {
				clearInterval(intervalId as unknown as number);
				resolve(el as T);
			}
		}, 10);
	});
}

export interface IWlDatabase extends HTMLElement {
	auth: IAuthService;
	live: boolean;
	query: string;
	target: string;
}

export async function initWlDatabase(query: string): Promise<IWlDatabase> {
	await customElements.whenDefined("wl-database");
	const wlDatabase: IWlDatabase = await waitElement("wl-database");

	wlDatabase.query = query;
	wlDatabase.auth = authService;

	return wlDatabase;
}

export async function getWlDatabase(selector?: string): Promise<IWlDatabase> {
	await customElements.whenDefined("wl-database");
	const wlDatabase: IWlDatabase = await waitElement(selector || "wl-database");

	return wlDatabase;
}
