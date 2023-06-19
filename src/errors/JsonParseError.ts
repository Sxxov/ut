import { ClientError } from './ClientError.js';

export class JsonParseError extends ClientError {
	constructor(message?: string) {
		super(`Failed to parse JSON${message ? `: ${message}` : ''}`);
	}
}
