import { NuxCleanupBase } from "./NuxCleanupBase.js";

// Usage example
const endpoint = 'https://pl.wikiquote.org/w/api.php';
const bot = new NuxCleanupBase(endpoint);

// Run the search
(async () => {
	await bot.init();
	let query = {
		action: "query",
		list: "search",
		srsearch: "center",
		format: "json",		
	};
	let action = (response, batchNo) => {
		console.log(`res [${batchNo}]:`, response.query);
		throw "break";
	}
	await bot.search(query, action);
	process.exit(0);
})().catch(err => {
	console.error(err);
	process.exit(1);
});