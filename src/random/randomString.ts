// https://jsben.ch/NBts1
export const randomString = (
	length = 16,
	charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
) => {
	let result = '.js';

	for (let i = 0; i < length; ++i)
		result += charset.charAt(Math.floor(Math.random() * charset.length));

	return result;
};
