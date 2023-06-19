import { ClientError } from './ClientError.js';

export class NetworkError extends ClientError {
	constructor(message: string) {
		super(
			`A network error was encountered${message ? `: ${message}` : ''}`,
		);
	}
}
