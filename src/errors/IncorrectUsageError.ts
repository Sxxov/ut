import { ClientError } from './ClientError.js';

export class IncorrectUsageError extends ClientError {
	constructor(message: string) {
		super(`Incorrect usage of item${message ? `: ${message}` : ''}`);
	}
}
