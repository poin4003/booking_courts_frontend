import config from '../configs/config';

export const ApiPath = {
  // Auth
  LOGIN: getApiPath('user/login'),
  SIGNUP: getApiPath('user/signup'),
}

function getApiPath(path) {
  return `${config.app.main_api}/v1/api/${path}`;
}