import { NuxCleanupBase } from "./NuxCleanupBase.js";
import { fixCenter } from "./fixCenter.js";
import { fixTitleLang } from "./fixTitleLang.js";

// Usage example
const site = 'pl.wikiquote.org';
// const site = 'pl.wikipedia.org';
const bot = new NuxCleanupBase(site);

// Run the search
(async () => {
	await bot.init();

	await fixCenter(bot);
	// await fixTitleLang(bot);
	
	console.log('Done');
	
	process.exit(0);
})().catch(err => {
	console.error(err);
	process.exit(1);
});