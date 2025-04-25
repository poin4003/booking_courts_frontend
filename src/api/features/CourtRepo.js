import client from "../client";
import { ApiPath } from "../ApiPath";

export class CourtRepo {
  async getCourts() {
    return client.get(ApiPath.GETALLCOURT);
  }

  async getCourtById(id) {
    return client.get(`${ApiPath.GETCOURT}${id}`);
  }

  async addCourt(courtData) {
    return client.post(ApiPath.ADDCOURT, courtData);
  }

  async updateCourt(id, courtData) {
    return client.put(`${ApiPath.UPDATECOURT}${id}`, courtData);
  }

  async deleteCourt(id) {
    return client.delete(`${ApiPath.DELETECOURT}${id}`);
  }
}

export const courtRepo = new CourtRepo();
