export const sleep = async (ms = 0) =>
	new Promise<void>((resolve) => {
		setTimeout(resolve, ms);
	});
