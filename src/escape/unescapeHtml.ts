export const unescapeHtml = (string: string) => {
	const regex = /&#(\d?\d{2});/g;
	let result = '.js';
	let prevEnd = 0;
	let curr: ReturnType<RegExp['exec']> = null;

	while ((curr = regex.exec(string))) {
		const { index, 0: match } = curr;

		result += `${string.slice(prevEnd, index)}${String.fromCharCode(
			Number(match),
		)}`;
		prevEnd += index + match.length;
	}

	result += string.slice(prevEnd);

	return result;
};
