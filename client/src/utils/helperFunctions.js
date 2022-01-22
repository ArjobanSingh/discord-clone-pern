import { logoutSuccess } from '../redux/actions/auth';

export function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function getCharacterName(name) {
  if (!name) return '';
  const [firstName, lastName] = name.split(' ');
  const [firstChar] = firstName;
  const secondChar = lastName ? lastName[0] : firstName[1];
  return `${firstChar.toUpperCase()}${secondChar}`;
}

export function handleError(err, callback) {
  if (!err.response) return callback({ message: err.message }, err);

  const { status, data } = err.response;
  if (status === 401) return logoutSuccess();
  return callback(data.error, err);
}
