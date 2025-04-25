import React, { useEffect, useState } from 'react';
import { useCourt } from '../hooks/useCourt';

function Courts() {
  const { courts, loading, error, fetchCourts, addCourt } = useCourt();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [activeType, setActiveType] = useState('all');

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);

  const handleAddCourt = (e) => {
    e.preventDefault();
    addCourt(name, location);
    setName('');
    setLocation('');
  };

  const courtTypes = [
    { id: 'all', label: 'Tất cả' },
    { id: 'soccer', label: 'Bóng đá' },
    { id: 'basketball', label: 'Bóng rổ' },
    { id: 'tennis', label: 'Tennis' },
    { id: 'baseball', label: 'Bóng chày' },
    { id: 'volleyball', label: 'Bóng chuyền' },
  ];

  const mockCourts = [
    { 
      id: 1, 
      name: 'Sân bóng đá Mỹ Đình',
      type: 'soccer',
      location: 'Quận Hoàn Kiếm, Hà Nội',
      rating: 4.8,
      capacity: 22,
      price: '2.000.000đ',
      image: 'https://images2.thanhnien.vn/zoom/700_438/Uploaded/lanphuong/2022_12_24/san-my-dinh-mat-co-1-truoc-tran-ma-aff-cup-2022-2412-2560.jpg'
    },
    { 
      id: 2, 
      name: 'Sân bóng rổ Phú Thọ',
      type: 'basketball',
      location: 'Quận 11, TP.HCM',
      rating: 4.5,
      capacity: 10,
      price: '300.000đ',
      image: 'https://hutisport.vn/wp-content/uploads/2024/03/san-bong-ro-o-tphcm.png'
    },
    { 
      id: 3, 
      name: 'Sân Tennis Riverside',
      type: 'tennis',
      location: 'Quận 12, TP.HCM',
      rating: 4.7,
      capacity: 4,
      price: '250.000đ',
      image: 'https://tennissaigon.com/wp-content/uploads/2021/08/san-tennis-quan-12.jpg'
    },
    { 
      id: 4, 
      name: 'Sân bóng chày Đông Đô',
      type: 'baseball',
      location: 'Quận Long Biên, Hà Nội',
      rating: 4.6,
      capacity: 18,
      price: '180.000đ',
      image: 'https://imagevietnam.vnanet.vn//MediaUpload/Org/2023/08/08/38-14-56-15.jpg'
    },
    { 
      id: 5, 
      name: 'Sân bóng chuyền Bắc Từ Liêm',
      type: 'volleyball',
      location: 'Quận Bắc Từ Liêm, Hà Nội',
      rating: 4.4,
      capacity: 12,
      price: '100.000đ',
      image: 'https://tinphatsports.vn/wp-content/uploads/2024/07/San-bong-chuyen-Vinhomes-Riverside-Long-Bien.jpg'
    },
    { 
      id: 6, 
      name: 'Sân Futsal Q2',
      type: 'soccer',
      location: 'Quận 2, TP.HCM',
      rating: 4.9,
      capacity: 14,
      price: '250.000đ',
      image: 'https://static.tuoitre.vn/tto/i/s626/2017/04/06/futsalngoaitroi-1491471541.jpg'
    },
  ];

  const displayCourts = activeType === 'all' 
    ? mockCourts 
    : mockCourts.filter(court => court.type === activeType);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Danh sách sân thể thao</h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Tìm và đặt sân phù hợp cho hoạt động thể thao của bạn
        </p>
      </div>

      {/* Search Box */}
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Loại sân</label>
              <select 
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                onChange={(e) => setActiveType(e.target.value)}
                value={activeType}
              >
                {courtTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
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

      {/* Filters */}
      <div className="mt-8 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm">
          {courtTypes.map(type => (
            <button
              key={type.id}
              className={`
                px-4 py-2 text-sm font-medium 
                ${activeType === type.id ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} 
                border border-gray-200 
                ${courtTypes.indexOf(type) === 0 ? 'rounded-l-md' : ''} 
                ${courtTypes.indexOf(type) === courtTypes.length - 1 ? 'rounded-r-md' : ''}
              `}
              onClick={() => setActiveType(type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Courts Grid */}
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="text-gray-500 text-center col-span-3">Đang tải...</p>}
        {error && <p className="text-red-500 text-center col-span-3">{error}</p>}

        {displayCourts.map((court) => (
          <div key={court.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
            <div className="relative h-48">
              <img
                src={court.image}
                alt={court.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 bg-emerald-600 text-white px-2 py-1 m-2 text-xs font-bold rounded">
                {courtTypes.find(type => type.id === court.type)?.label}
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{court.name}</h3>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-sm text-gray-600">{court.rating}</span>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{court.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Tối đa {court.capacity} người chơi</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-emerald-600 font-semibold">{court.price}/giờ</div>
                <button
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm"
                  onClick={() => alert(`Đặt sân: ${court.name}`)}
                >
                  Đặt ngay
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Court Form */}
      {/* Add this if you want admin functionality */}
      <div className="mt-12">
        <form onSubmit={handleAddCourt} className="max-w-lg mx-auto space-y-4 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-center">Thêm sân mới</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên sân</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Địa điểm</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white p-2 rounded-md hover:bg-emerald-700 transition"
          >
            Thêm sân
          </button>
        </form>
      </div>
    </div>
  );
}

export default Courts;