import { Store } from '../Store.js';

export class ExtensibleStore<T = unknown> extends Store<T> {
	protected proxy = new Proxy(this, {
		get(o, k) {
			if (k in o) return o[k as keyof typeof o];

			const value = o.value[k as keyof typeof o.value];

			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			if (value instanceof Function) return value.bind(o.value);

			return value;
		},
		set(o, k, v) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			if (k in o) o[k as keyof typeof o] = v;
			else {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				o.value[k as keyof typeof o.value] = v;
				o.trigger();
			}

			return true;
		},
	});
}
