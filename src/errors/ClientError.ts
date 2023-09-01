import { type PlainError } from './PlainError.js';

export class ClientError extends Error {
	constructor(message = 'No message provided, an error with errors?') {
		super(message);
		this.name = this.constructor.name;

		// eslint is drunk
		// eslint-disable-next-line
		(Error as any).captureStackTrace?.(this, this.constructor);
	}

	public static from<T extends ClientError>(obj: PlainError | Error): T {
		const clientError = new this();

		clientError.name = obj.name;
		clientError.message = obj.message;
		if (obj.stack) clientError.stack = obj.stack;

		return clientError as T;
	}

	public toPlainObject(): PlainError {
		return {
			name: this.name,
			message: this.message,
			...(this.stack && { stack: this.stack }),
		};
	}
}
