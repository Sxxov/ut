import { randomKey } from './randomKey.js';

export const randomValue = <T extends Record<any, any>>(obj: T): T[keyof T] =>
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	obj[randomKey(obj)];
