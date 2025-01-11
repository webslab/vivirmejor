export const WEBSLAB_PROJECT = "base";
export const WEBSLAB_DOMAIN = "ipsitec.es";
export const WEBSLAB_TOKEN = "TOKEN"; // TODO: temporary, should be user token

export const SITE_TITLE = "Base";
export const SITE_DESCRIPTION = "Welcome to Base!";

// TODO: Change to production URL
export const DB = {
	url: "ws://localhost:8000/",
	config: {
		access: "user",
		database: WEBSLAB_PROJECT,
		namespace: "webslab",
	},
};

// export const DB: DbConfig = {
// 	url: 'https://db.lab.kennycallado.dev/',
// 	config: {
// 		access: 'user',
// 		database: 'webslab',
// 		namespace: 'base',
// 	},
// }
