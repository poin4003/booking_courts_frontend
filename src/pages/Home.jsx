import React, { useEffect, useState } from 'react';
import Courts from './Courts';
import { courtRepo } from '../api/features/CourtRepo';

function Home() {
  const [activeType, setActiveType] = useState('all');
  const [location, setLocation] = useState('');
  const [courts, setCourts] = useState([]);
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [districtSuggestions, setDistrictSuggestions] = useState([]);
  const [wardSuggestions, setWardSuggestions] = useState([]);
  const [showDistrictSuggestions, setShowDistrictSuggestions] = useState(false);
  const [showWardSuggestions, setShowWardSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      setLoading(true);
      
      const filterParams = {
        limit: 10, 
        skip: 1
      };
      
      if (activeType !== 'all' && activeType.trim() !== '') {
        filterParams.sportTypes = [activeType.trim()];
      }
      
      if (location.trim() !== '') {
        filterParams.venueName = location.trim();
      }

      if (district.trim() !== '') {
        filterParams.district = district.trim();
      }

      if (ward.trim() !== '') {
        filterParams.ward = ward.trim();
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

  const goongApiKey = '0cbAqIA7NZimLsVEiazPK4OdQCWStFG1jFeciE1U';

  const searchPlaces = async (input, type) => {
    if (input.length < 2) return [];
    
    try {
      const response = await fetch(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=${goongApiKey}&input=${encodeURIComponent(input + " tp hcm")}&location=10.762622,106.660172&radius=30000`
      );
      const data = await response.json();
      
      if (data.predictions) {
        return data.predictions
          .filter(place => {
            const description = place.description.toLowerCase();
            if (!description.includes('tp. hồ chí minh') && 
                !description.includes('thành phố hồ chí minh') && 
                !description.includes('ho chi minh city')) {
              return false;
            }
            
            if (type === 'district') {
              return description.includes('quận') || description.includes('huyện') || 
                    description.includes('thành phố') || description.includes('thị xã');
            } else if (type === 'ward') {
              return description.includes('phường') || description.includes('xã') || 
                    description.includes('thị trấn');
            }
            return false;
          })
          .slice(0, 5)
          .map(place => ({
            id: place.place_id,
            name: place.structured_formatting?.main_text || place.description.split(',')[0],
            fullAddress: place.description
          }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  };

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const debouncedDistrictSearch = debounce(async (input) => {
    const suggestions = await searchPlaces(input, 'district');
    setDistrictSuggestions(suggestions);
  }, 300);

  const debouncedWardSearch = debounce(async (input) => {
    const suggestions = await searchPlaces(input, 'ward');
    setWardSuggestions(suggestions);
  }, 300);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-emerald-700 h-[50vh]">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover object-[center_35%]"
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
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Nhập loại sân (vd: football, basketball, tennis...)"
                    value={activeType === 'all' ? '' : activeType}
                    onChange={(e) => setActiveType(e.target.value || 'all')}
                  />
                </div>
              </div>
                
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sân</label>
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
                    placeholder="Nhập tên sân"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Nhập quận/huyện"
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      if (e.target.value.length >= 2) {
                        debouncedDistrictSearch(e.target.value);
                        setShowDistrictSuggestions(true);
                      } else {
                        setShowDistrictSuggestions(false);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowDistrictSuggestions(false), 200)}
                  />
                </div>
                
                {showDistrictSuggestions && districtSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {districtSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          setDistrict(suggestion.name);
                          setShowDistrictSuggestions(false);
                        }}
                      >
                        <div className="font-medium">{suggestion.name}</div>
                        <div className="text-gray-500 text-xs">{suggestion.fullAddress}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Nhập phường/xã"
                    value={ward}
                    onChange={(e) => {
                      setWard(e.target.value);
                      if (e.target.value.length >= 2) {
                        debouncedWardSearch(e.target.value);
                        setShowWardSuggestions(true);
                      } else {
                        setShowWardSuggestions(false);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowWardSuggestions(false), 200)}
                  />
                </div>
                
                {showWardSuggestions && wardSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {wardSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          setWard(suggestion.name);
                          setShowWardSuggestions(false);
                        }}
                      >
                        <div className="font-medium">{suggestion.name}</div>
                        <div className="text-gray-500 text-xs">{suggestion.fullAddress}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
                
              <div className="flex items-end space-x-2">
                <button
                  onClick={fetchCourts}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Tìm kiếm
                </button>
                <button
                  onClick={() => {
                    setActiveType('all');
                    setLocation('');
                    setDistrict('');
                    setWard('');
                    setTimeout(() => fetchCourts(), 0);
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