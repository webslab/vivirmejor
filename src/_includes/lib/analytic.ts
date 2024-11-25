import { authService } from "./auth.ts";
import type { Analytic } from "./types.ts";

authService.isReady.then(() => {
	const db = authService.getDb();
	const user = authService.getUser() || authService.getRandUser();

	if (!user.id) {
		console.error("No user id found");
		return;
	}

	const [pageNav] = performance.getEntriesByType("navigation");
	// @ts-ignore: foo
	const totalLookupTime = pageNav.domainLookupEnd - pageNav.domainLookupStart;
	// @ts-ignore: foo
	const connectionTime = pageNav.connectEnd - pageNav.connectStart;

	let tlsTime = 0; // <-- Assume 0 to start with
	// @ts-ignore: foo
	if (pageNav.secureConnectionStart > 0) {
		// @ts-ignore: foo
		tlsTime = pageNav.connectEnd - pageNav.secureConnectionStart;
	}

	const dataToSend: Analytic = {
		user_id: user.id,
		location: {
			href: location.href,
			host: location.host,
			origin: location.origin,
			pathname: location.pathname,
			search: location.search,
		},
		navigator: {
			lang: navigator.language,
			agent: navigator.userAgent,
			// @ts-ignore: foo
			platf: navigator.platform,
			// @ts-ignore: foo
			other: navigator.userAgentData
				? {
					// @ts-ignore: foo
					brands: [navigator.userAgentData.brands[0]],
					// @ts-ignore: foo
					mobile: navigator.userAgentData.mobile,
				}
				: null,
		},
		performance: {
			totalLookupTime,
			connectionTime,
			tlsTime,
		},
	};

	db.create("analytic", dataToSend);
});
