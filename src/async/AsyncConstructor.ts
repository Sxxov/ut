export abstract class AsyncConstructor {
	protected constructor() {}

	public static async new<T = AsyncConstructor>(..._args: any[]): Promise<T> {
		return undefined as unknown as Promise<T>;
	}
}
