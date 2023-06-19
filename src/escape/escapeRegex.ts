export const escapeRegex = (string: string) =>
	string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
