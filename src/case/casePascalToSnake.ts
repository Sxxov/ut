import { caseCamelToPascal } from './caseCamelToPascal.js';
import { caseSnakeToCamel } from './caseSnakeToCamel.js';

export const casePascalToSnake = (v: string) =>
	caseCamelToPascal(caseSnakeToCamel(v));
