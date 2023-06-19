export const randomInt = () =>
	Math.sign(Math.random() - 0.5) *
	Math.trunc(Math.random() * Number.MAX_SAFE_INTEGER);
