export const randomKey = <T extends Record<any, any>>(obj: T): keyof T => {
	if (obj instanceof Array) return Math.floor(Math.random() * obj.length);

	const keys = Object.keys(obj);

	return keys[Math.floor(Math.random() * keys.length)];
};
