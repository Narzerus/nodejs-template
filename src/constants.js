import { Constants } from 'discord.js';
import { each } from 'lodash';

export const API_ERROR_CODES = {};
each(Constants.APIErrors, (code, key) => {
  API_ERROR_CODES[code] = key;
});
