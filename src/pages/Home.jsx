import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthContext';

function Home() {
  const { user } = useAuth();

  return (
    <div className="text-center">
      <div className="bg-blue-100 p-8 rounded-lg shadow-md mb-6">
        <h2 className="text-3xl font-bold mb-4">
          Chào mừng đến với Booking Courts{user ? `, ${user.name}!` : '!'}
        </h2>
        <p className="text-gray-700 mb-6">
          Đặt sân vận động dễ dàng và nhanh chóng. Tìm sân phù hợp và bắt đầu chơi ngay hôm nay!
        </p>
        <Link
          to="/courts"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Xem danh sách sân
        </Link>
      </div>
    </div>
  );
}

export default Home;