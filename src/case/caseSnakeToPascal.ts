import { caseCamelToPascal } from './caseCamelToPascal.js';
import { caseSnakeToCamel } from './caseSnakeToCamel.js';

export const caseSnakeToPascal = (v: string) =>
	caseCamelToPascal(caseSnakeToCamel(v));
