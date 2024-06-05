import fs from 'fs';
import path from 'path';

/**
 * Simple file and console logger.
 */
export class Logger {
	constructor(filename, append=true) {
		this.filename = filename;
		this._makeDir(path.dirname(filename));
		this._initializeLog(append);
	}

	log(...args) {
		const message = this._formatMessage('LOG', ...args);
		console.log(...args);
		this._writeToFile(message);
	}

	info(...args) {
		const message = this._formatMessage('INFO', ...args);
		console.info(...args);
		this._writeToFile(message);
	}

	warn(...args) {
		const message = this._formatMessage('WARN', ...args);
		console.warn(...args);
		this._writeToFile(message);
	}

	error(...args) {
		const message = this._formatMessage('ERROR', ...args);
		console.error(...args);
		this._writeToFile(message);
	}


	/** @private Formatting arguments to string. */
	_formatMessage(level, ...args) {
		return `${level}: ${args.map(v=> typeof v ==='string' ? v : JSON.stringify(v)).join(' ')}`;
	}	

	/** @private Startup info. */
	_initializeLog(append=true) {
		const currentTime = new Date().toISOString();
		const initialMessage = `\n--------------------\nStarted at: ${currentTime}\n`;
		const fun = append ? fs.appendFile : fs.writeFile;
		fun(this.filename, initialMessage, (err) => {
			if (err) throw err;
		});
	}

	/** @private Write message to file. */
	_writeToFile(message) {
		fs.appendFile(this.filename, message + '\n', (err) => {
			if (err) throw err;
		});
	}

	/** @private */
	_makeDir(dir) {
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
	}
}

/**
 * Usage example.
 */
function test () {
	const append = false;
	const logger = new Logger('./io/logger-test.txt', append);
	logger.log('This is a log message');
	logger.info('This is an info message');
	logger.warn('This is a warning message');
	logger.error('This is an error message');

	logger.info('This is a complex message', {abc:'def'}, [1,2,3]);
}
// test();