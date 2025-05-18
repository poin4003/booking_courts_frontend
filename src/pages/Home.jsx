import React from 'react';
import { Link } from 'react-router-dom';
import Courts from './Courts';
// import { useAuth } from '../context/auth/AuthContext';

function Home() {
  // const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-emerald-700">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Sports field with bright lights"
          />
          <div className="absolute inset-0 bg-emerald-700 opacity-75 mix-blend-multiply"></div>
        </div>
        
        {/* Hiển thị button Admin nếu người dùng có vai trò ADMIN */}
        {/* {user && user.role && user.role.includes('ADMIN') && ( */}
          <div className="absolute top-4 right-4 z-10">
            <Link
              to="/admin/venues"
              className="px-4 py-2 bg-white text-emerald-600 font-medium rounded-md shadow-md hover:bg-gray-50 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Quản lý sân
            </Link>
          </div>
        {/* )} */}
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Tìm và đặt sân thể thao
          </h1>
          <p className="mt-6 text-xl text-emerald-100 max-w-3xl">
            Khám phá và đặt sân phù hợp cho trận đấu của bạn. Đặt sân dễ dàng, xác nhận ngay lập tức.
          </p>
          
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Hàng trăm sân chất lượng đang chờ bạn
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Tìm kiếm, so sánh và đặt sân thể thao yêu thích của bạn ngay hôm nay
            </p>
            <div className="">
              <Courts/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;