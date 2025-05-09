import React, { useState, useEffect } from 'react';
import { courtRepo } from '../api/features/CourtRepo';
// import { useAuth } from '../context/auth/AuthContext';
// import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function AdminVenues() {
  // const { user } = useAuth();
  // const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: {
      type: 'Point',
      coordinates: [106.6297, 10.8231], 
      city: '',
      district: '',
      ward: '',
      street: '',
      full_address: ''
    },
    sport_types: [],
    amenities: [],
    images: [],
    slots: [],
    deals: []
  });
  const [newSportType, setNewSportType] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [newSlot, setNewSlot] = useState({
    date: '',
    time: '',
    price: 0,
    status: 'available'
  });

  const [newImage, setNewImage] = useState('');
  const [newDeal, setNewDeal] = useState('');

  const [searchAddress, setSearchAddress] = useState('');
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [availableWards, setAvailableWards] = useState([]);

  const hcmcDistricts = [
    "Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", 
    "Quận 8", "Quận 9", "Quận 10", "Quận 11", "Quận 12", "Quận Bình Tân", 
    "Quận Bình Thạnh", "Quận Gò Vấp", "Quận Phú Nhuận", "Quận Tân Bình", 
    "Quận Tân Phú", "Quận Thủ Đức", "Huyện Bình Chánh", "Huyện Cần Giờ", 
    "Huyện Củ Chi", "Huyện Hóc Môn", "Huyện Nhà Bè", "Thành phố Thủ Đức"
  ];
  
  const wardsByDistrict = {
    "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành", "Phường Cầu Kho", "Phường Cầu Ông Lãnh", 
              "Phường Cô Giang", "Phường Đa Kao", "Phường Nguyễn Cư Trinh", "Phường Nguyễn Thái Bình", 
              "Phường Phạm Ngũ Lão", "Phường Tân Định"],
    "Quận 2": ["Phường An Khánh", "Phường An Lợi Đông", "Phường An Phú", "Phường Bình An", 
              "Phường Bình Khánh", "Phường Bình Trưng Đông", "Phường Bình Trưng Tây", 
              "Phường Cát Lái", "Phường Thạnh Mỹ Lợi", "Phường Thảo Điền", "Phường Thủ Thiêm"],
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Không thể lấy thông tin địa chỉ');
      }
      
      const data = await response.json();
      const address = data.address;
      
      const isInHCMC = 
        address.city === 'Thành phố Hồ Chí Minh' ||
        address.city === 'Ho Chi Minh City' ||
        address.state === 'Thành phố Hồ Chí Minh' ||
        address.state === 'Ho Chi Minh City';
      
      if (!isInHCMC) {
        return { isInHCMC: false };
      }
      
      const city = "Thành phố Hồ Chí Minh";
      
      let district = '';
      if (address.suburb) {
        district = address.suburb;
      } else if (address.district) {
        district = address.district;
      } else if (address.county) {
        district = address.county;
      }
      
      const ward = address.neighbourhood || address.quarter || '';
      
      const street = address.road || '';
      
      const full_address = data.display_name || '';
      
      return {
        isInHCMC: true,
        city,
        district,
        ward,
        street,
        full_address
      };
    } catch (error) {
      console.error('Error fetching address:', error);
      toast.error('Không thể lấy thông tin địa chỉ từ tọa độ. Vui lòng nhập thủ công.');
      return null;
    }
  };
  
  const mapWardName = (wardName, district) => {
    if (!wardName || !district || !wardsByDistrict[district]) return '';
    
    const cleanWardName = wardName.replace(/ward|phường|p\./gi, '').trim();
    
    const normalizeString = (str) => {
      return str.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d");
    };
    
    const normalizedWardName = normalizeString(cleanWardName);
    console.log('Clean ward name:', cleanWardName);
    console.log('Normalized ward name:', normalizedWardName);
    
    for (const ward of wardsByDistrict[district]) {
      const normalizedListWard = normalizeString(ward.replace(/phường/gi, '').trim());
      
      if (normalizedListWard === normalizedWardName || 
          normalizedListWard.includes(normalizedWardName) || 
          normalizedWardName.includes(normalizedListWard)) {
        console.log('Mapped ward name:', wardName, '->', ward);
        return ward;
      }
    }
    
    for (const ward of wardsByDistrict[district]) {
      const normalizedListWard = normalizeString(ward);
      
      const wordParts = normalizedWardName.split(' ');
      for (const part of wordParts) {
        if (part.length > 3 && normalizedListWard.includes(part)) {
          console.log('Partial ward match:', wardName, '->', ward);
          return ward;
        }
      }
    }
    
    console.log('No ward match found for:', wardName, 'in district', district);
    return wardName; 
  };
  
  const searchLocationByAddress = async () => {
    if (!searchAddress) return;
    
    try {
      setSearchingAddress(true);
      
      const searchQuery = `${searchAddress}, Hồ Chí Minh, Việt Nam`;
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1&countrycodes=vn`
      );
      
      if (!response.ok) {
        throw new Error('Không thể tìm kiếm địa chỉ');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        
        const address = result.address;
        const isInHCMC = 
          address.city === 'Thành phố Hồ Chí Minh' ||
          address.city === 'Ho Chi Minh City' ||
          address.state === 'Thành phố Hồ Chí Minh' ||
          address.state === 'Ho Chi Minh City';
        
        if (!isInHCMC) {
          toast.warning('Địa chỉ không thuộc TP. Hồ Chí Minh. Vui lòng chọn địa chỉ trong phạm vi TP.HCM.');
          setSearchingAddress(false);
          return;
        }
        
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        
        setMarkerPosition([lat, lng]);
        
        const city = "Thành phố Hồ Chí Minh"; 
        
        let district = '';
        if (address.suburb) {
          district = address.suburb;
        } else if (address.district) {
          district = address.district;
        } else if (address.county) {
          district = address.county;
        }
        
        const ward = address.neighbourhood || address.quarter || '';
        const street = address.road || '';
        const full_address = result.display_name || '';
        
        console.log('Raw API response:', result);
        console.log('Raw address data:', address);
        console.log('Raw district from API:', district);
        console.log('Raw ward from API:', ward);
        
        let matchedDistrict = null;
        
        const districtPatterns = {
          "Quận 1": [/quận 1\b/i, /\bdistrict 1\b/i, /\bq1\b/i, /\bd1\b/i, /\b1st district\b/i],
          "Quận 2": [/quận 2\b/i, /\bdistrict 2\b/i, /\bq2\b/i, /\bd2\b/i, /\b2nd district\b/i],
          "Quận 3": [/quận 3\b/i, /\bdistrict 3\b/i, /\bq3\b/i, /\bd3\b/i, /\b3rd district\b/i],
          "Quận 4": [/quận 4\b/i, /\bdistrict 4\b/i, /\bq4\b/i, /\bd4\b/i, /\b4th district\b/i],
          "Quận 5": [/quận 5\b/i, /\bdistrict 5\b/i, /\bq5\b/i, /\bd5\b/i, /\b5th district\b/i],
          "Quận 6": [/quận 6\b/i, /\bdistrict 6\b/i, /\bq6\b/i, /\bd6\b/i, /\b6th district\b/i],
          "Quận 7": [/quận 7\b/i, /\bdistrict 7\b/i, /\bq7\b/i, /\bd7\b/i, /\b7th district\b/i],
          "Quận 8": [/quận 8\b/i, /\bdistrict 8\b/i, /\bq8\b/i, /\bd8\b/i, /\b8th district\b/i],
          "Quận 9": [/quận 9\b/i, /\bdistrict 9\b/i, /\bq9\b/i, /\bd9\b/i, /\b9th district\b/i],
          "Quận 10": [/quận 10\b/i, /\bdistrict 10\b/i, /\bq10\b/i, /\bd10\b/i, /\b10th district\b/i],
          "Quận 11": [/quận 11\b/i, /\bdistrict 11\b/i, /\bq11\b/i, /\bd11\b/i, /\b11th district\b/i],
          "Quận 12": [/quận 12\b/i, /\bdistrict 12\b/i, /\bq12\b/i, /\bd12\b/i, /\b12th district\b/i],
          "Quận Bình Tân": [/bình tân/i, /binh tan/i],
          "Quận Bình Thạnh": [/bình thạnh/i, /binh thanh/i],
          "Quận Gò Vấp": [/gò vấp/i, /go vap/i],
          "Quận Phú Nhuận": [/phú nhuận/i, /phu nhuan/i],
          "Quận Tân Bình": [/tân bình/i, /tan binh/i],
          "Quận Tân Phú": [/tân phú/i, /tan phu/i],
          "Quận Thủ Đức": [/thủ đức/i, /thu duc/i],
          "Huyện Bình Chánh": [/bình chánh/i, /binh chanh/i],
          "Huyện Cần Giờ": [/cần giờ/i, /can gio/i],
          "Huyện Củ Chi": [/củ chi/i, /cu chi/i],
          "Huyện Hóc Môn": [/hóc môn/i, /hoc mon/i],
          "Huyện Nhà Bè": [/nhà bè/i, /nha be/i],
          "Thành phố Thủ Đức": [/thành phố thủ đức/i, /tp thủ đức/i, /tp thu duc/i]
        };
        
        for (const [districtName, patterns] of Object.entries(districtPatterns)) {
          if (patterns.some(pattern => pattern.test(district)) || 
              patterns.some(pattern => pattern.test(result.display_name))) {
            matchedDistrict = districtName;
            break;
          }
        }
        
        if (!matchedDistrict) {
          matchedDistrict = hcmcDistricts.find(d => 
            district.toLowerCase().includes(d.toLowerCase()) || 
            d.toLowerCase().includes(district.toLowerCase())
          );
        }
        
        if (matchedDistrict) {
          district = matchedDistrict;
        }
        
        let mappedWard = ward;
        if (matchedDistrict && ward && wardsByDistrict[matchedDistrict]) {
          mappedWard = mapWardName(ward, matchedDistrict);
        }
        
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: [lng, lat],
            city,
            district,
            ward: mappedWard,
            street,
            full_address
          }
        }));
        
        if (matchedDistrict && wardsByDistrict[matchedDistrict]) {
          setAvailableWards(wardsByDistrict[matchedDistrict]);
        }
        
        toast.success('Đã tìm thấy địa chỉ ở TP.HCM');
        
        console.log('District from API:', district);
        console.log('Matched district:', matchedDistrict);
        console.log('Ward from API:', ward);
        console.log('Mapped ward:', mappedWard);
        console.log('Available wards for district:', wardsByDistrict[matchedDistrict] || []);
      } else {
        toast.error('Không tìm thấy địa chỉ ở TP.HCM. Vui lòng thử lại với từ khóa khác.');
      }
    } catch (error) {
      console.error('Error searching address:', error);
      toast.error('Lỗi khi tìm kiếm địa chỉ. Vui lòng thử lại sau.');
    } finally {
      setSearchingAddress(false);
    }
  };

const districtPatterns = {
  "Quận 1": [/quận 1\b/i, /\bdistrict 1\b/i, /\bq1\b/i, /\bd1\b/i, /\b1st district\b/i],
  "Quận 2": [/quận 2\b/i, /\bdistrict 2\b/i, /\bq2\b/i, /\bd2\b/i, /\b2nd district\b/i],
  "Quận 3": [/quận 3\b/i, /\bdistrict 3\b/i, /\bq3\b/i, /\bd3\b/i, /\b3rd district\b/i],
  "Quận 4": [/quận 4\b/i, /\bdistrict 4\b/i, /\bq4\b/i, /\bd4\b/i, /\b4th district\b/i],
  "Quận 5": [/quận 5\b/i, /\bdistrict 5\b/i, /\bq5\b/i, /\bd5\b/i, /\b5th district\b/i],
  "Quận 6": [/quận 6\b/i, /\bdistrict 6\b/i, /\bq6\b/i, /\bd6\b/i, /\b6th district\b/i],
  "Quận 7": [/quận 7\b/i, /\bdistrict 7\b/i, /\bq7\b/i, /\bd7\b/i, /\b7th district\b/i],
  "Quận 8": [/quận 8\b/i, /\bdistrict 8\b/i, /\bq8\b/i, /\bd8\b/i, /\b8th district\b/i],
  "Quận 9": [/quận 9\b/i, /\bdistrict 9\b/i, /\bq9\b/i, /\bd9\b/i, /\b9th district\b/i],
  "Quận 10": [/quận 10\b/i, /\bdistrict 10\b/i, /\bq10\b/i, /\bd10\b/i, /\b10th district\b/i],
  "Quận 11": [/quận 11\b/i, /\bdistrict 11\b/i, /\bq11\b/i, /\bd11\b/i, /\b11th district\b/i],
  "Quận 12": [/quận 12\b/i, /\bdistrict 12\b/i, /\bq12\b/i, /\bd12\b/i, /\b12th district\b/i],
  "Quận Bình Tân": [/bình tân/i, /binh tan/i],
  "Quận Bình Thạnh": [/bình thạnh/i, /binh thanh/i],
  "Quận Gò Vấp": [/gò vấp/i, /go vap/i],
  "Quận Phú Nhuận": [/phú nhuận/i, /phu nhuan/i],
  "Quận Tân Bình": [/tân bình/i, /tan binh/i],
  "Quận Tân Phú": [/tân phú/i, /tan phu/i],
  "Quận Thủ Đức": [/thủ đức/i, /thu duc/i],
  "Huyện Bình Chánh": [/bình chánh/i, /binh chanh/i],
  "Huyện Cần Giờ": [/cần giờ/i, /can gio/i],
  "Huyện Củ Chi": [/củ chi/i, /cu chi/i],
  "Huyện Hóc Môn": [/hóc môn/i, /hoc mon/i],
  "Huyện Nhà Bè": [/nhà bè/i, /nha be/i],
  "Thành phố Thủ Đức": [/thành phố thủ đức/i, /tp thủ đức/i, /tp thu duc/i]
};

  function LocationMarker() {
    const map = useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        
        setLoadingAddress(true);
        
        try {
          const addressInfo = await getAddressFromCoordinates(lat, lng);
          
          if (!addressInfo) {
            setLoadingAddress(false);
            return;
          }
          
          if (!addressInfo.isInHCMC) {
            toast.warning('Vị trí không thuộc TP. Hồ Chí Minh. Vui lòng chọn vị trí trong phạm vi TP.HCM.');
            setLoadingAddress(false);
            return;
          }
          
          setMarkerPosition([lat, lng]);
          
          console.log('Raw address info from map click:', addressInfo);
          
          let district = addressInfo.district;
          let matchedDistrict = null;
          
          for (const [districtName, patterns] of Object.entries(districtPatterns)) {
            if (patterns.some(pattern => pattern.test(district)) || 
                patterns.some(pattern => pattern.test(addressInfo.full_address))) {
              matchedDistrict = districtName;
              break;
            }
          }
          
          if (!matchedDistrict) {
            matchedDistrict = hcmcDistricts.find(d => 
              district.toLowerCase().includes(d.toLowerCase()) || 
              d.toLowerCase().includes(district.toLowerCase())
            );
          }
          
          if (matchedDistrict) {
            district = matchedDistrict;
            
            if (wardsByDistrict[matchedDistrict]) {
              setAvailableWards(wardsByDistrict[matchedDistrict]);
            }
          }
          
          let mappedWard = addressInfo.ward;
          if (matchedDistrict && addressInfo.ward && wardsByDistrict[matchedDistrict]) {
            mappedWard = mapWardName(addressInfo.ward, matchedDistrict);
          }
          
          console.log('District from API:', addressInfo.district);
          console.log('Matched district:', matchedDistrict);
          console.log('Ward from API:', addressInfo.ward);
          console.log('Mapped ward:', mappedWard);
          console.log('Available wards for district:', wardsByDistrict[matchedDistrict] || []);
          
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: [lng, lat],
              city: addressInfo.city,
              district: district,
              ward: mappedWard,
              street: addressInfo.street,
              full_address: addressInfo.full_address
            }
          }));
        } catch (error) {
          console.error('Error getting address:', error);
          toast.error('Không thể lấy thông tin địa chỉ từ tọa độ. Vui lòng thử lại.');
        } finally {
          setLoadingAddress(false);
        }
      },
    });

    useEffect(() => {
      if (markerPosition) {
        map.flyTo(markerPosition, map.getZoom());
      }
    }, [markerPosition, map]);

    return markerPosition ? <Marker position={markerPosition} /> : null;
  }

  // useEffect(() => {
  //   if (!user || !user.role || !user.role.includes('ADMIN')) {
  //     navigate('/');
  //     toast.error('Bạn không có quyền truy cập trang này');
  //   }
  // }, [user, navigate]);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await courtRepo.getCourts();
      setVenues(response.metadata || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching venues:', err);
      setError('Không thể tải danh sách sân. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  

  const openAddModal = () => {
    setSelectedVenue(null);
    setFormData({
      name: '',
      phone: '',
      location: {
        type: 'Point',
        coordinates: [106.7009, 10.7769], 
        city: 'Thành phố Hồ Chí Minh',
        district: '',
        ward: '',
        street: '',
        full_address: ''
      },
      sport_types: [],
      amenities: [],
      images: [],
      slots: [],
      deals: []
    });
    
    setNewSlot({
      date: '',
      time: '',
      price: 0,
      status: 'available'
    });
    
    setNewImage('');
    setNewDeal('');
    setAvailableWards([]);
    setSearchAddress('');
    
    setMarkerPosition([10.7769, 106.7009]);
    
    setIsModalOpen(true);
  };
  
  const openEditModal = (venue) => {
    setSelectedVenue(venue);
    
    setFormData({
      name: venue.name,
      phone: venue.phone || '',
      location: venue.location || {
        type: 'Point',
        coordinates: [106.7009, 10.7769], 
        city: 'Thành phố Hồ Chí Minh', 
        district: '',
        ward: '',
        street: '',
        full_address: ''
      },
      sport_types: venue.sport_types || [],
      amenities: venue.amenities || [],
      images: venue.images || [],
      slots: venue.slots || [],
      deals: venue.deals || []
    });
    
    if (venue.location && venue.location.city !== 'Thành phố Hồ Chí Minh') {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          city: 'Thành phố Hồ Chí Minh'
        }
      }));
    }
    
    if (venue.location && venue.location.district && wardsByDistrict[venue.location.district]) {
      setAvailableWards(wardsByDistrict[venue.location.district]);
    } else {
      setAvailableWards([]);
    }
    
    setSearchAddress('');
    
    setNewSlot({
      date: '',
      time: '',
      price: 0,
      status: 'available'
    });
    
    setNewImage('');
    setNewDeal('');
    
    if (venue.location && venue.location.coordinates && venue.location.coordinates.length === 2) {
      setMarkerPosition([
        venue.location.coordinates[1],
        venue.location.coordinates[0]  
      ]);
    } else {
      setMarkerPosition([10.7769, 106.7009]);
    }
    
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "location.district") {
      setAvailableWards(wardsByDistrict[value] || []);
      
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [name.split('.')[1]]: value,
          ward: '' 
        }
      }));
    } else if (name.includes('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addSportType = () => {
    if (!newSportType) {
      toast.error('Vui lòng nhập loại sân');
      return;
    }
    
    setFormData({
      ...formData,
      sport_types: [...formData.sport_types, newSportType]
    });
    
    setNewSportType('');
  };
  
  const removeSportType = (index) => {
    const updatedSportTypes = [...formData.sport_types];
    updatedSportTypes.splice(index, 1);
    setFormData({
      ...formData,
      sport_types: updatedSportTypes
    });
  };
  
  const addAmenity = () => {
    if (!newAmenity) {
      toast.error('Vui lòng nhập tiện ích');
      return;
    }
    
    setFormData({
      ...formData,
      amenities: [...formData.amenities, newAmenity]
    });
    
    setNewAmenity('');
  };
  
  const removeAmenity = (index) => {
    const updatedAmenities = [...formData.amenities];
    updatedAmenities.splice(index, 1);
    setFormData({
      ...formData,
      amenities: updatedAmenities
    });
  };

  const handleNewSlotChange = (e) => {
    const { name, value } = e.target;
    setNewSlot({
      ...newSlot,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    });
  };

  const addSlot = () => {
    if (!newSlot.date || !newSlot.time || newSlot.price <= 0) {
      toast.error('Vui lòng điền đầy đủ thông tin slot');
      return;
    }
    
    setFormData({
      ...formData,
      slots: [...formData.slots, {...newSlot}]
    });
    
    setNewSlot({
      date: '',
      time: '',
      price: 0,
      status: 'available'
    });
  };

  const removeSlot = (index) => {
    const updatedSlots = [...formData.slots];
    updatedSlots.splice(index, 1);
    setFormData({
      ...formData,
      slots: updatedSlots
    });
  };

  const addImage = () => {
    if (!newImage) {
      toast.error('Vui lòng nhập URL hình ảnh');
      return;
    }
    
    setFormData({
      ...formData,
      images: [...formData.images, newImage]
    });
    
    setNewImage('');
  };

  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages
    });
  };

  const addDeal = () => {
    if (!newDeal) {
      toast.error('Vui lòng nhập thông tin khuyến mãi');
      return;
    }
    
    setFormData({
      ...formData,
      deals: [...formData.deals, newDeal]
    });
    
    setNewDeal('');
  };

  const removeDeal = (index) => {
    const updatedDeals = [...formData.deals];
    updatedDeals.splice(index, 1);
    setFormData({
      ...formData,
      deals: updatedDeals
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (!formData.location.district || !formData.location.ward || !formData.location.street) {
        toast.error('Vui lòng điền đầy đủ thông tin địa chỉ (Quận/Huyện, Phường/Xã, Đường)');
        setLoading(false);
        return;
      }
      
      const dataToSend = {...formData};
      
      if (dataToSend.location) {
        dataToSend.location.type = 'Point';
        
        dataToSend.location.city = 'Thành phố Hồ Chí Minh';
        
        if (markerPosition) {
          dataToSend.location.coordinates = [
            parseFloat(markerPosition[1]), 
            parseFloat(markerPosition[0])  
          ];
        }
        
        if (!dataToSend.location.full_address || dataToSend.location.full_address.trim() === '') {
          dataToSend.location.full_address = `${dataToSend.location.street}, ${dataToSend.location.ward}, ${dataToSend.location.district}, ${dataToSend.location.city}`;
        }
      }
      
      if (dataToSend.slots && dataToSend.slots.length > 0) {
        dataToSend.slots = dataToSend.slots.map(slot => {
          const { _id, ...slotWithoutId } = slot;
          return {
            ...slotWithoutId,
            price: parseFloat(slotWithoutId.price)
          };
        });
      }
      
      console.log('Sending data:', dataToSend);
      
      if (selectedVenue) {
        await courtRepo.updateCourt(selectedVenue._id, dataToSend);
        toast.success('Cập nhật sân thành công!');
      } else {
        await courtRepo.addCourt(dataToSend);
        toast.success('Thêm sân mới thành công!');
      }
      
      setIsModalOpen(false);
      fetchVenues();
    } catch (err) {
      console.error('Error saving venue:', err);
      toast.error(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sân này?')) {
      try {
        setLoading(true);
        await courtRepo.deleteCourt(id);
        toast.success('Xóa sân thành công!');
        fetchVenues();
      } catch (err) {
        console.error('Error deleting venue:', err);
        toast.error('Không thể xóa sân. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Quản lý sân thể thao</h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Thêm, chỉnh sửa hoặc xóa các sân thể thao trong hệ thống
        </p>
      </div>
  
      <div className="mt-8 flex justify-end">
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm sân mới
          </div>
        </button>
      </div>
  
      {loading && <p className="text-center mt-8">Đang tải...</p>}
      {error && <p className="text-center text-red-500 mt-8">{error}</p>}
  
      {/* Danh sách venue */}
      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sân</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại sân</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiện ích</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {venues.length > 0 ? (
              venues.map((venue) => (
                <tr key={venue._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{venue.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{venue.location && venue.location.full_address}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{venue.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {venue.sport_types && venue.sport_types.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {venue.amenities && venue.amenities.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => openEditModal(venue)}
                      className="text-emerald-600 hover:text-emerald-900 mr-4 cursor-pointer"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(venue._id)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              !loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    Không có sân nào. Hãy thêm sân mới!
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
  
      {/* Modal thêm/sửa venue */}
      {isModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white rounded-lg max-w-4xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedVenue ? 'Chỉnh sửa sân' : 'Thêm sân mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
  
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên sân</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
  
              {/* Thông tin địa chỉ */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Thông tin vị trí tại TP.HCM</h4>
                
                {/* Tìm kiếm địa chỉ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tìm vị trí tại TP.HCM
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      placeholder="Nhập địa chỉ tại TP.HCM để tìm"
                      className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={searchLocationByAddress}
                      disabled={searchingAddress}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:bg-emerald-400"
                    >
                      {searchingAddress ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang tìm...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Gợi ý: Nhập tên đường, quận để tìm kiếm (ví dụ: Nguyễn Huệ, Quận 1)
                  </p>
                </div>
                
                {/* Bản đồ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vị trí (click vào bản đồ để chọn)
                  </label>
                  <div className="h-64 w-full border border-gray-300 rounded-md overflow-hidden">
                    <MapContainer 
                      center={markerPosition || [10.7769, 106.7009]} 
                      zoom={12} 
                      style={{ height: '100%', width: '100%' }} 
                      scrollWheelZoom={true}
                      maxBounds={[
                        [10.3776, 106.3638], 
                        [11.1601, 107.0351]  
                      ]}
                      minZoom={10}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationMarker />
                    </MapContainer>
                  </div>
                  {markerPosition && (
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span>Tọa độ đã chọn: {markerPosition[0].toFixed(6)}, {markerPosition[1].toFixed(6)}</span>
                        {loadingAddress && (
                          <div className="ml-2 flex items-center">
                            <svg className="animate-spin h-4 w-4 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="ml-1 text-xs text-emerald-600">Đang lấy thông tin địa chỉ...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Địa chỉ đầy đủ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ đầy đủ</label>
                  <input
                    type="text"
                    name="location.full_address"
                    value={formData.location.full_address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Địa chỉ đầy đủ sẽ được tự động tạo nếu để trống"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố</label>
                    <input
                      type="text"
                      name="location.city"
                      value="Thành phố Hồ Chí Minh"
                      readOnly
                      className="w-full border border-gray-300 bg-gray-50 p-2 rounded-md"
                    />
                    <input
                      type="hidden"
                      name="location.city"
                      value="Thành phố Hồ Chí Minh"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                    <select
                      name="location.district"
                      value={formData.location.district}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="">-- Chọn Quận/Huyện --</option>
                      {hcmcDistricts.map((district, index) => (
                        <option key={index} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                    {formData.location.district && wardsByDistrict[formData.location.district] ? (
                      <select
                        name="location.ward"
                        value={formData.location.ward}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      >
                        <option value="">-- Chọn Phường/Xã --</option>
                        {wardsByDistrict[formData.location.district].map((ward, index) => (
                          <option key={index} value={ward}>{ward}</option>
                        ))}
                        {/* Nếu phường hiện tại không có trong danh sách, thêm một tùy chọn riêng cho nó */}
                        {formData.location.ward && 
                        !wardsByDistrict[formData.location.district].includes(formData.location.ward) && (
                          <option value={formData.location.ward}>{formData.location.ward}</option>
                        )}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="location.ward"
                        value={formData.location.ward}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                        placeholder="Nhập tên phường/xã"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đường</label>
                    <input
                      type="text"
                      name="location.street"
                      value={formData.location.street}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                      placeholder="Nhập tên đường"
                    />
                  </div>
                </div>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại sân</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newSportType}
                      onChange={(e) => setNewSportType(e.target.value)}
                      className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Nhập loại sân"
                    />
                    <button
                      type="button"
                      onClick={addSportType}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      Thêm
                    </button>
                  </div>
                  
                  {formData.sport_types.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Danh sách loại sân:</p>
                      <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                        {formData.sport_types.map((type, index) => (
                          <div key={index} className="flex items-center justify-between py-1 border-b border-gray-200">
                            <div className="text-sm">{type}</div>
                            <button
                              type="button"
                              onClick={() => removeSportType(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Xóa
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
  
                {/* Phần quản lý tiện ích */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiện ích</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Nhập tiện ích"
                    />
                    <button
                      type="button"
                      onClick={addAmenity}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      Thêm
                    </button>
                  </div>
                  
                  {formData.amenities.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Danh sách tiện ích:</p>
                      <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                        {formData.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center justify-between py-1 border-b border-gray-200">
                            <div className="text-sm">{amenity}</div>
                            <button
                              type="button"
                              onClick={() => removeAmenity(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Xóa
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
  
              {/* Phần quản lý hình ảnh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="URL hình ảnh"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    Thêm
                  </button>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Danh sách hình ảnh:</p>
                    <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="flex items-center justify-between py-1 border-b border-gray-200">
                          <div className="text-sm truncate">{image}</div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                          >
                            Xóa
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
  
              {/* Phần quản lý slot */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slots (lịch trình)</label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input
                    type="date"
                    name="date"
                    value={newSlot.date}
                    onChange={handleNewSlotChange}
                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ngày"
                  />
                  <input
                    type="text"
                    name="time"
                    value={newSlot.time}
                    onChange={handleNewSlotChange}
                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Giờ (vd: 10:00-12:00)"
                  />
                  <input
                    type="number"
                    name="price"
                    value={newSlot.price}
                    onChange={handleNewSlotChange}
                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Giá"
                    min="0"
                    step="0.01"
                  />
                  <div className="flex items-center space-x-2">
                    <select
                      name="status"
                      value={newSlot.status}
                      onChange={handleNewSlotChange}
                      className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="available">Trống</option>
                      <option value="pending">Đang chờ</option>
                      <option value="booked">Đã đặt</option>
                    </select>
                    <button
                      type="button"
                      onClick={addSlot}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      Thêm
                    </button>
                  </div>
                </div>
  
                {formData.slots.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Danh sách slots:</p>
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md mt-1">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Ngày</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Giờ</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Giá</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Trạng thái</th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {formData.slots.map((slot, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                {new Date(slot.date).toLocaleDateString()}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{slot.time}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{slot.price}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  slot.status === 'available' ? 'bg-green-100 text-green-800' :
                                  slot.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {slot.status === 'available' ? 'Trống' : 
                                   slot.status === 'pending' ? 'Đang chờ' : 'Đã đặt'}
                                </span>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  type="button"
                                  onClick={() => removeSlot(index)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Xóa
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
  
              {/* Phần quản lý khuyến mãi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Khuyến mãi</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newDeal}
                    onChange={(e) => setNewDeal(e.target.value)}
                    className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Thông tin khuyến mãi"
                  />
                  <button
                    type="button"
                    onClick={addDeal}
                    className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Thêm
                  </button>
                </div>
                
                {formData.deals.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Danh sách khuyến mãi:</p>
                    <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                      {formData.deals.map((deal, index) => (
                        <div key={index} className="flex items-center justify-between py-1 border-b border-gray-200">
                          <div className="text-sm">{deal}</div>
                          <button
                            type="button"
                            onClick={() => removeDeal(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Xóa
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
  
              <div className="flex justify-end pt-4 space-x-3 sticky bottom-0 bg-white z-10 border-t border-gray-200 mt-6 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:bg-emerald-400 cursor-pointer" 
                >
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminVenues;