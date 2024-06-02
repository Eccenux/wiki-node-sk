import { NuxCleanupBase } from "./NuxCleanupBase.js";
import { fixCenter } from "./fixCenter.js";

// Usage example
const site = 'pl.wikiquote.org';
const bot = new NuxCleanupBase(site);

// Run the search
(async () => {
	await bot.init();

	await fixCenter(bot);
	
	process.exit(0);
})().catch(err => {
	console.error(err);
	process.exit(1);
});