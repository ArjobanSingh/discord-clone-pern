import { ValidationError } from "class-validator";
import { ValidationErrorName } from "./constants";


export const createValidationError = (errors: ValidationError[]) => {
    const error = {};
    errors.forEach(({ property, constraints }) => {
      error[property] = constraints[Object.keys(constraints)[0]];
    });
    return {
      name: ValidationErrorName,
      status: 400,
      error,
    };
} 