import fs from 'fs'

import {ESTTodayDateTimeLabel} from '@solidbasisventures/intelliwaketsfoundation'

export type TFileReadStreamOptions = {
	onLine?: (data: string) => void
	onFirstLine?: (data: string) => void
	onSubsequentLine?: (data: string) => void
	pauseAfterLines?: number | null
}

export async function FileReadStream(fileName: string, options: TFileReadStreamOptions) {
	return new Promise<void>((resolve, reject) => {
		const files = fs.createReadStream(fileName)
			.pipe(createStream())
		                // .pipe(split())

		let linesStarted = 0
		let linesCompleted = 0

		files
			.on('data', (data) => {
				linesStarted++

				const isFirst = linesStarted === 1

				let lineDifferential = linesCompleted - linesStarted

				if (
					options.pauseAfterLines !== null &&
					(options.pauseAfterLines === undefined || options.pauseAfterLines >= lineDifferential)
				) {
					files.pause()
				}

				if (!!data && !!data.toString().trim()) {
					if (options.onFirstLine && isFirst) options.onFirstLine(data.toString())
					if (options.onLine) options.onLine(data.toString())
					if (options.onSubsequentLine && !isFirst) options.onSubsequentLine(data.toString())
				}

				linesCompleted++

				lineDifferential = linesCompleted - linesStarted

				if (
					files.isPaused() &&
					(!options.pauseAfterLines || !lineDifferential || options.pauseAfterLines <= lineDifferential)
				) {
					files.resume()
				}
			})
			.on('error', (err) => {
				console.warn(ESTTodayDateTimeLabel(), err)
				reject(err.message)
			})
			// .on('finish', () => {
			//     console.log('Finished ------------')
			//     resolve(this)
			// })
			// .on('end', () => {
			//     console.log('Ended ------------')
			//     resolve(this)
			// })
			.on('close', () => {
				resolve()
			})
	})
}

// eslint-disable-next-line no-unused-vars
import { Duplex, DuplexOptions } from 'stream';

interface Options {
	newlineChar?: Buffer;
}

export class SplitStream extends Duplex {
	private _chunks: Buffer;

	private _outputBuffer: Array<Buffer | null>;

	private _writeCallback: Function | null;

	private _newlineChar: Buffer;

	private _newlineCharLength: number;

	private _readableState!: {
		objectMode: boolean;
		sync: boolean;
		needReadable: boolean;
	};

	constructor({ newlineChar }: Options = {}, duplexArgs: DuplexOptions = {}) {
		super(duplexArgs);

		this._chunks = Buffer.alloc(0);
		this._outputBuffer = [];

		this._newlineChar = Buffer.isBuffer(newlineChar)
			? newlineChar
			: Buffer.from('\n');

		this._newlineCharLength = this._newlineChar.length;

		this._writeCallback = null;

		this._readableState.objectMode = true;
		this._readableState.sync = false;
	}

	_write(chunk: Buffer, _encoding: string, callback: Function): void {
		this._chunks = Buffer.concat([this._chunks, chunk]);
		let newlinePos = this._chunks.indexOf(this._newlineChar);
		if (newlinePos === -1) {
			callback();
			return;
		}
		let currentChunk = this._chunks;
		while (newlinePos > -1) {
			this._chunks = currentChunk.slice(0, newlinePos + this._newlineCharLength);
			const line = this._chunks;
			this._outputBuffer.push(line);
			if (this._readableState.needReadable) this._read();
			currentChunk = currentChunk.slice(newlinePos + this._newlineCharLength);
			newlinePos = currentChunk.indexOf(this._newlineChar);
			this._chunks = Buffer.alloc(0);
		}
		if (currentChunk.length) this._chunks = currentChunk;
		this._writeCallback = callback;
	}

	_read() {
		if (!this._outputBuffer.length && this._writeCallback) {
			const cb = this._writeCallback;
			this._writeCallback = null;
			cb();
		}

		while (this._outputBuffer.length) {
			const chunk = this._outputBuffer.shift();
			if (!this.push(chunk)) {
				break;
			}
		}
	}

	_final(callback: Function): void {
		if (this._chunks.length) {
			const line = this._chunks;
			this._outputBuffer.push(line);
		}
		this._outputBuffer.push(null);
		if (this._readableState.needReadable) this._read();
		callback();
	}
}

export function createStream(args?: Options, duplexArgs: DuplexOptions = {}) {
	return new SplitStream(args, duplexArgs);
}
