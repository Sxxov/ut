export class ClientError extends Error {
	constructor(message = 'No message provided, an error with errors?') {
		super(message);
		this.name = this.constructor.name;

		// eslint is drunk
		// eslint-disable-next-line
		(Error as any).captureStackTrace?.(this, this.constructor);
	}

	public static from<T extends ClientError>(obj: Error): T {
		const clientError = new this();

		clientError.name = obj.name;
		clientError.message = obj.message;
		if (obj.stack) clientError.stack = obj.stack;
		if (obj.cause) clientError.cause = obj.cause;

		return clientError as T;
	}
}
