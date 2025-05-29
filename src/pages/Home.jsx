import React, { useEffect, useState } from 'react';
import Courts from './Courts';
import { courtRepo } from '../api/features/CourtRepo';

function Home() {
  const [activeType, setActiveType] = useState('all');
  const [location, setLocation] = useState('');
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourts();
  }, [activeType, location]);

  const fetchCourts = async () => {
    try {
      setLoading(true);
      
      const filterParams = {};
      
      if (activeType !== 'all') {
        filterParams.sport_types = activeType;
      }
      
      if (location.trim() !== '') {
        filterParams.location = location.trim();
      }
      
      const response = await courtRepo.getCourtsWithFilter(filterParams);
      const courtsData = response.metadata || [];
      
      setCourts(courtsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching courts:', err);
      setError('Không thể tải danh sách sân. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

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
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại sân</label>
                <select 
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                  value={activeType}
                  onChange={(e) => setActiveType(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="football">Sân bóng đá</option>
                  <option value="basketball">Sân bóng rổ</option>
                  <option value="tennis">Sân tennis</option>
                  <option value="volleyball">Sân bóng chuyền</option>
                </select>
              </div>
                
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Nhập quận/huyện hoặc phường/xã"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
                
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setActiveType('all');
                    setLocation('');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Đặt lại
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="">
              <Courts courts={courts} loading={loading} error={error} fetchCourts={fetchCourts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;