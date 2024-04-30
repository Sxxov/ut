import { Store } from '../Store.js';

export class SuppressibleStore extends Store<number> {
	public override set(value: number, suppressed = false) {
		if (suppressed) this.value = value;
		else super.set(value);
	}
}
