import { NuxCleanupBase } from "./NuxCleanupBase.js";
import { Logger } from "./Logger.js";
import { fixCenter } from "./fixCenter.js";
import { fixTitleLang } from "./fixTitleLang.js";

// Site
const site = 'pl.wikiquote.org';
// const site = 'pl.wikipedia.org';
const bot = new NuxCleanupBase(site);

// Log file
const logger = new Logger('./io/wc_center.tex');

// Run the search
(async () => {
	await bot.init(logger);

	//
	// Fixes (search & change)
	//
	await fixCenter(bot);
	// await fixTitleLang(bot);
	
	logger.log('Done');
	
	process.exit(0);
})().catch(err => {
	logger.error(err);
	process.exit(1);
});