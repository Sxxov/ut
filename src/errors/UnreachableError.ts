import { ClientError } from './ClientError.js';

export class UnreachableError extends ClientError {
	constructor(message?: string) {
		super(
			`Somehow, you're in an unreachable part of code${
				message ? `: ${message}` : ''
			}`,
		);
	}
}
