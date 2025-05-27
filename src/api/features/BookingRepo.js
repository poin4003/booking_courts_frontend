import client from "../client";
import { ApiPath } from "../ApiPath";

export class BookingRepoClass {
  async bookSlot(bookingData) {
    return client.post(ApiPath.BOOKING, bookingData);
  }

  async getBookings(limit = 10, page = 1) {
    return client.get(ApiPath.GET_BOOKINGS, { limit, page });
  }

  async createVnpayPayment(bookingData) {
    return client.post(ApiPath.PAYMENT_URL, bookingData);
  }
}

export const bookingRepo = new BookingRepoClass();
