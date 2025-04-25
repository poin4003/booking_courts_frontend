import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthContext';

function Home() {
  const { user } = useAuth();

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
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Tìm và đặt sân thể thao
          </h1>
          <p className="mt-6 text-xl text-emerald-100 max-w-3xl">
            Khám phá và đặt sân phù hợp cho trận đấu của bạn. Đặt sân dễ dàng, xác nhận ngay lập tức.
          </p>
          
          {/* Search Box */}
          <div className="mt-10 max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden md:max-w-3xl">
            <div className="md:flex">
              <div className="p-4 w-full">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Loại sân</label>
                    <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md">
                      <option value="all">Tất cả</option>
                      <option value="soccer">Sân bóng đá</option>
                      <option value="basketball">Sân bóng rổ</option>
                      <option value="tennis">Sân tennis</option>
                      <option value="volleyball">Sân bóng chuyền</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Địa điểm</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="Nhập địa điểm của bạn"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Ngày</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="date"
                        className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      className="bg-emerald-600 py-3 px-5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Cách đặt sân</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Đặt sân của bạn trong bốn bước đơn giản
            </p>
          </div>
          <div className="mt-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">Tìm sân</h3>
                  <p className="mt-2 text-base text-gray-500">Tìm kiếm sân theo loại, địa điểm và ngày.</p>
                </div>
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200">
                  <div className="absolute right-0 w-0 h-0 border-t-8 border-r-0 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-gray-200"></div>
                </div>
              </div>
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">Chọn thời gian</h3>
                  <p className="mt-2 text-base text-gray-500">Chọn từ các khung giờ có sẵn phù hợp với lịch trình của bạn.</p>
                </div>
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200">
                  <div className="absolute right-0 w-0 h-0 border-t-8 border-r-0 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-gray-200"></div>
                </div>
              </div>
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">Thanh toán</h3>
                  <p className="mt-2 text-base text-gray-500">Đảm bảo đặt sân của bạn với quy trình thanh toán đơn giản.</p>
                </div>
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200">
                  <div className="absolute right-0 w-0 h-0 border-t-8 border-r-0 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-gray-200"></div>
                </div>
              </div>
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">Tận hưởng trận đấu</h3>
                  <p className="mt-2 text-base text-gray-500">Nhận xác nhận và sẵn sàng chơi!</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 flex justify-center">
            <Link
              to="/courts"
              className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Đặt sân ngay
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Fields Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Sân nổi bật</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Khám phá những sân thể thao phổ biến nhất có sẵn để đặt
            </p>
          </div>
          
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow-sm">
              <button className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white border border-gray-200 rounded-l-md">
                Tất cả
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200">
                Bóng đá
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200">
                Bóng rổ
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200">
                Tennis
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200">
                Bóng chuyền
              </button>
            </div>
          </div>
          
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Court Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
              <div className="relative h-48">
                <img
                  src="https://images2.thanhnien.vn/zoom/700_438/Uploaded/lanphuong/2022_12_24/san-my-dinh-mat-co-1-truoc-tran-ma-aff-cup-2022-2412-2560.jpg"
                  alt="Sân bóng đá trung tâm"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-emerald-600 text-white px-2 py-1 m-2 text-xs font-bold rounded">
                  Bóng đá
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Sân bóng đá Mỹ Đình</h3>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm text-gray-600">4.8</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Quận Hoàn Kiếm, Hà Nội</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Tối đa 22 người chơi</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-emerald-600 font-semibold">2.000.000đ/giờ</div>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm">
                    Đặt ngay
                  </button>
                </div>
              </div>
            </div>

            {/* Court Card 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
              <div className="relative h-48">
                <img
                  src="https://hutisport.vn/wp-content/uploads/2024/03/san-bong-ro-o-tphcm.png"
                  alt="Sân bóng rổ phía Tây"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-emerald-600 text-white px-2 py-1 m-2 text-xs font-bold rounded">
                  Bóng rổ
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Sân bóng rổ Phú Thọ</h3>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm text-gray-600">4.5</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Quận 11, TP.HCM</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Tối đa 10 người chơi</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-emerald-600 font-semibold">300.000đ/giờ</div>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm">
                    Đặt ngay
                  </button>
                </div>
              </div>
            </div>

            {/* Court Card 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
              <div className="relative h-48">
                <img
                  src="https://tennissaigon.com/wp-content/uploads/2021/08/san-tennis-quan-12.jpg"
                  alt="Sân Tennis Riverside"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-emerald-600 text-white px-2 py-1 m-2 text-xs font-bold rounded">
                  Tennis
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Sân Tennis Riverside</h3>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm text-gray-600">4.7</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Quận 12, TP.HCM</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Tối đa 4 người chơi</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-emerald-600 font-semibold">250.000đ/giờ</div>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm">
                    Đặt ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Link
              to="/courts"
              className="px-6 py-3 bg-white border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
            >
              Xem tất cả sân
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Khách hàng nói gì về chúng tôi</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Đừng chỉ tin lời chúng tôi - hãy nghe từ những khách hàng hài lòng của chúng tôi
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">
                "Tìm và đặt sân bóng đá chưa bao giờ dễ dàng đến thế. Trước đây chúng tôi phải gọi điện hàng giờ, nhưng giờ có thể đặt trong vài phút!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                  alt="Minh Nguyễn" 
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Minh Nguyễn</h4>
                  <p className="text-sm text-gray-500">Đội trưởng đội bóng đá</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-1 mb-4">
                {[1, 2, 3, 4].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p className="text-gray-600 italic mb-6">
                "Chất lượng các sân có sẵn thật tuyệt vời. Hình ảnh rõ ràng và thông tin chi tiết đã giúp chúng tôi tìm thấy sân bóng rổ hoàn hảo cho giải đấu của mình."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                  alt="Thu Hà" 
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Thu Hà</h4>
                  <p className="text-sm text-gray-500">Huấn luyện viên bóng rổ</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">
                "Tôi rất thích cách dễ dàng để so sánh các sân và giá cả khác nhau. Xác nhận đặt sân ngay lập tức và dịch vụ khách hàng thật tuyệt vời!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                  alt="Hải Long" 
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Hải Long</h4>
                  <p className="text-sm text-gray-500">Người chơi tennis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;