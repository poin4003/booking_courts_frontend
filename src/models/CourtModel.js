export class CourtModel {
  async getCourts() {
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
    return new Promise((resolve) =>
      setTimeout(() => resolve({ id: Date.now(), ...court }), 500),
    );
  }
}