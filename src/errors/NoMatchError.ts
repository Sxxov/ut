import { ClientError } from './ClientError.js';

export class NoMatchError extends ClientError {
	constructor(message?: string) {
		super(`No match was found${message ? `: ${message}` : ''}`);
	}
}
