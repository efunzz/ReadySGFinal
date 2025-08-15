// Simple API service using public Singapore data
const DATA_GOV_BASE = 'https://api.data.gov.sg/v1';

// Fetch real weather alerts (for your flash flood scenarios)
export const fetchWeatherAlerts = async () => {
  try {
    const response = await fetch(`${DATA_GOV_BASE}/environment/2-hour-weather-forecast`);
    const data = await response.json();
    return formatWeatherData(data);
  } catch (error) {
    console.error('Weather fetch error:', error);
    return getFallbackWeatherData();
  }
};

// Fetch air quality (PSI levels)
export const fetchAirQuality = async () => {
  try {
    const response = await fetch(`${DATA_GOV_BASE}/environment/psi`);
    const data = await response.json();
    return formatAirQualityData(data);
  } catch (error) {
    console.error('Air quality fetch error:', error);
    return null;
  }
};

// For medical facilities, use static but realistic Singapore data
export const fetchMedicalFacilities = async () => {
  // Real Singapore hospitals with accurate info
  return [
    { 
      name: 'Singapore General Hospital', 
      address: '1 Hospital Drive, Singapore 169608', 
      distance: calculateRandomDistance(), 
      status: 'Open 24/7',
      phone: '6222 3322'
    },
    { 
      name: 'Tan Tock Seng Hospital', 
      address: '11 Jalan Tan Tock Seng, Singapore 308433', 
      distance: calculateRandomDistance(), 
      status: 'Open 24/7',
      phone: '6256 6011'
    },
    { 
      name: 'National University Hospital', 
      address: '5 Lower Kent Ridge Road, Singapore 119074', 
      distance: calculateRandomDistance(), 
      status: 'Open 24/7',
      phone: '6779 5555'
    },
    { 
      name: 'KK Women\'s and Children\'s Hospital', 
      address: '100 Bukit Timah Road, Singapore 229899', 
      distance: calculateRandomDistance(), 
      status: 'Open 24/7',
      phone: '6225 5554'
    },
    { 
      name: 'Changi General Hospital', 
      address: '2 Simei Street 3, Singapore 529889', 
      distance: calculateRandomDistance(), 
      status: 'Open 24/7',
      phone: '6788 8833'
    }
  ];
};

// Real Singapore MRT stations
export const fetchTransportFacilities = async () => {
  return [
    { 
      name: 'Toa Payoh MRT Station', 
      address: 'North South Line', 
      distance: '0.3 km', 
      status: 'Operating',
      code: 'NS19'
    },
    { 
      name: 'Orchard MRT Station', 
      address: 'North South Line', 
      distance: '2.1 km', 
      status: 'Operating',
      code: 'NS22'
    },
    { 
      name: 'City Hall MRT Station', 
      address: 'North South & East West Line', 
      distance: '1.8 km', 
      status: 'Operating',
      code: 'NS25/EW13'
    },
    { 
      name: 'Dhoby Ghaut MRT Station', 
      address: 'North South, North East & Circle Line', 
      distance: '1.5 km', 
      status: 'Operating',
      code: 'NS24/NE6/CC1'
    }
  ];
};

// Real Singapore shopping centers for supplies
export const fetchSupplyFacilities = async () => {
  return [
    { 
      name: 'NTUC FairPrice (Toa Payoh HDB Hub)', 
      address: '530 Lorong 6 Toa Payoh, #02-01', 
      distance: '0.4 km', 
      status: 'Open 24 hours',
      type: 'Supermarket'
    },
    { 
      name: 'Cold Storage (Centrepoint)', 
      address: '176 Orchard Road, #B2-02/03', 
      distance: '2.2 km', 
      status: 'Open 10am-10pm',
      type: 'Supermarket'
    },
    { 
      name: 'Giant (Vivocity)', 
      address: '1 HarbourFront Walk, #B2-01', 
      distance: '3.5 km', 
      status: 'Open 10am-10pm',
      type: 'Hypermarket'
    },
    { 
      name: 'Mustafa Centre', 
      address: '145 Syed Alwi Road', 
      distance: '2.8 km', 
      status: 'Open 24 hours',
      type: '24-hour Shopping'
    }
  ];
};

// Helper functions
const calculateRandomDistance = () => {
  return `${(Math.random() * 8 + 0.5).toFixed(1)} km`;
};

const formatWeatherData = (data) => {
  // Process real weather data for alerts
  const forecasts = data.items?.[0]?.forecasts || [];
  return forecasts.map(forecast => ({
    area: forecast.area,
    forecast: forecast.forecast,
    isAlert: forecast.forecast.includes('Thundery') || forecast.forecast.includes('Heavy')
  }));
};

const getFallbackWeatherData = () => [
  { area: 'Central', forecast: 'Partly Cloudy', isAlert: false },
  { area: 'East', forecast: 'Thundery Showers', isAlert: true },
  { area: 'West', forecast: 'Fair', isAlert: false }
];