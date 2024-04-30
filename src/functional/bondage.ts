/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const getAllPropertyNames = (obj: any) => {
	const props = new Set<string>();

	let curr = obj;
	do {
		for (const prop of Object.getOwnPropertyNames(obj)) props.add(prop);
	} while ((curr = Object.getPrototypeOf(curr)) && obj !== Object.prototype);

	return [...props];
};
/* eslint-enable */

/** Bind all function properties of an object to the object */
export const bondage = <T extends Record<any, any>>(obj: T) =>
	Object.assign(
		Object.create(obj),
		Object.fromEntries(
			getAllPropertyNames(obj)
				.filter((key) => typeof obj[key] === 'function')
				.map((key) => [key, (obj[key] as () => void).bind(obj)]),
		),
	) as T;
