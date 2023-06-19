import { caseCamelToKebab } from './caseCamelToKebab.js';
import { casePascalToCamel } from './casePascalToCamel.js';

export const casePascalToKebab = (v: string) =>
	caseCamelToKebab(casePascalToCamel(v));
