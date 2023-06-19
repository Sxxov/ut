export const sleepSync = (ms: number) => {
	const start = Date.now();

	try {
		Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 1, ms);
	} catch {
		while (start + ms <= Date.now());
	}
};
