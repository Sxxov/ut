export type TUnabstract<
	T extends abstract new (...args: any[]) => any,
	Args extends any[] = ConstructorParameters<T>,
	Return = InstanceType<T>,
> = (new (...args: Args) => Return) & Pick<T, keyof T>;
