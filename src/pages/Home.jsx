import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Chào mừng đến với Booking Courts!</h2>
      <Link
        to="/courts"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Xem danh sách sân
      </Link>
    </div>
  );
}

export default Home;