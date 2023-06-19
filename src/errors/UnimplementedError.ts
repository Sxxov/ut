import { ClientError } from './ClientError.js';

export class UnimplementedError extends ClientError {
	constructor(message?: string) {
		super(`Unimplemented${message ? `: ${message}` : ''}`);
	}
}
