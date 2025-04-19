// import client from '../../client';
// import { ApiPath } from '../../ApiPath';

export class CourtRepo {
  // Ví dụ: Nếu có API /courts
  async getCourts() {
    // return client.get(ApiPath.COURTS);
    // Hiện dùng mock data
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve([
            { id: 1, name: 'Sân Tennis A', location: 'Hà Nội' },
            { id: 2, name: 'Sân Bóng Rổ B', location: 'TP.HCM' },
          ]),
        500,
      ),
    );
  }

  async addCourt(court) {
    // return client.post(ApiPath.COURTS, court);
    return new Promise((resolve) =>
      setTimeout(() => resolve({ id: Date.now(), ...court }), 500),
    );
  }
}

export const courtRepo = new CourtRepo();