export const bondage = <T extends Record<any, any>>(obj: T) =>
	Object.assign(
		Object.create(obj),
		Object.fromEntries(
			Object.entries(obj)
				.filter(([key]) => typeof obj[key] === 'function')
				.map(([key, fn]) => [key, (fn as () => void).bind(obj)]),
		),
	) as T;
