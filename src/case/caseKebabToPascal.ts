import { caseCamelToPascal } from './caseCamelToPascal.js';
import { caseKebabToCamel } from './caseKebabToCamel.js';

export const caseKebabToPascal = (v: string) =>
	caseCamelToPascal(caseKebabToCamel(v));
