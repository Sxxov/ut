// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class AsyncConstructor {
	public static async new<T = AsyncConstructor>(..._args: any[]): Promise<T> {
		return undefined as unknown as Promise<T>;
	}

	protected constructor() {}
}
