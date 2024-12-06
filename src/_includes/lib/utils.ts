export function waitElement<T>(selector: string): Promise<T> {
	return new Promise((resolve, _reject) => {
		setInterval(() => {
			const el = document.querySelector(selector);

			if (el) {
				clearInterval(1);
				resolve(el as T);
			}
		}, 10);
	});
}
