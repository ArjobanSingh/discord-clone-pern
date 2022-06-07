import { ValidationError } from 'class-validator';
import { ValidationErrorName } from './constants';

export const createValidationErrorObject = (property: string, errorMessage: string) => ({
  property,
  constraints: {
    error: errorMessage,
  },
});

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
};

export class CustomError extends Error {
  public status: number;

  public data: unknown | undefined;

  constructor(message: string, code: number) {
    super(message);
    this.message = message;
    this.status = code;
  }
}
