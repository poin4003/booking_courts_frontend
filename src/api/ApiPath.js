import config from "../configs/config";

export const ApiPath = {
  // Auth
  LOGIN: getApiPath("user/login"),
  SIGNUP: getApiPath("user/signup"),

  //Venue
  ADDCOURT: getApiPath("venue"),
  GETALLCOURT: getApiPath("venue"),
  GETCOURT: getApiPath("venue/"),
  UPDATECOURT: getApiPath("venue/"),
  DELETECOURT: getApiPath("venue/"),
};

function getApiPath(path) {
  return `${config.app.main_api}/v1/api/${path}`;
}
