import client from "../client";
import { ApiPath } from "../ApiPath";

export class CourtRepo {
  async getCourts() {
    return client.get(ApiPath.GETALLCOURT);
  }

  async getCourtsWithFilter(params = {}) {
    const queryString = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (
        value &&
        value !== "all" &&
        typeof value === "string" &&
        value.trim() !== ""
      ) {
        queryString.append(key, value);
      }
    });

    const url = queryString.toString()
      ? `${ApiPath.GETALLCOURT}?${queryString.toString()}`
      : ApiPath.GETALLCOURT;

    return client.get(url);
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
