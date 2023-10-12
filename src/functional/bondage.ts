export const bondage = <T extends Record<any, any>>(obj: T) => {
	return new Proxy(
		obj,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		Object.assign(Object.create(Reflect), {
			get(target, prop, receiver) {
				const value = Reflect.get(target, prop, receiver);
				if (typeof value === 'function')
					return (value as () => any).bind(target);

				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return value;
			},
		} satisfies ProxyHandler<T>),
	);
};
