import { type SvgString } from './SvgString.js';

export const coerceSvgString = (string: string): SvgString =>
	string.includes('<svg') ? (string as SvgString) : `<svg not-an-svg />`;
