// yanked from https://stackoverflow.com/a/30558011
export const escapeHtml = (string: string) =>
	string
		.replace(/&/g, '&amp;')
		// surrogate pair
		.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function (value) {
			const hi = value.charCodeAt(0);
			const low = value.charCodeAt(1);
			return `&#${(hi - 0xd800) * 0x400 + (low - 0xdc00) + 0x10000};`;
		})
		// non-alphanumeric
		.replace(/([^#-~| |!])/g, function (value) {
			return `&#${value.charCodeAt(0)};`;
		})
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
