import axios from 'axios';

/**
 * @param {String} passcode
 * @returns {Promise}
 */
export const validateSecretPasscode = async passcode => {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  const response = await axios.get(
    `https://9w4qucosgf.execute-api.eu-central-1.amazonaws.com/default/CR-JS_team_M02a?code=${passcode}`,
    { headers });
  return response.data;
};