/* eslint-disable no-useless-escape */
export const emailformat = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const isEmailValid = (value) => emailformat.test(value);

export const isEmptyString = (str) => !str?.trim();

export const isEmpty = (value) => {
  if (!value) return true;
  if (typeof value === 'string') return isEmptyString(value);
  if (Array.isArray(value)) return !value.length;

  if (value instanceof Set || value instanceof Map) {
    return !value.size;
  }

  if (typeof value === 'object') return !Object.keys(value).length;
  return false;
};
