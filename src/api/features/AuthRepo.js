import client from "../client";
import { ApiPath } from "../ApiPath";

export class AuthRepo {
  async login(email, password) {
    return client.post(ApiPath.LOGIN, { email, password });
  }

  async signup(name, email, phone, password) {
    return client.post(ApiPath.SIGNUP, { name, email, phone, password });
  }

  async getCurrentUser() {
    return client.get(ApiPath.CURRENT_USER);
  }
}

export const authRepo = new AuthRepo();
