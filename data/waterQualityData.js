import { parameterColors, gradients } from '../constants/colors';

// Generate mock history data for 3 months (auto-delete older data)
export const generateHistory = (baseValue, unit, variance) => {
  const history = [];
  const now = new Date();
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  // Generate data every 6 hours for 3 months
  const intervalHours = 6;
  const totalEntries = Math.floor((3 * 30 * 24) / intervalHours); // ~360 entries
  
  for (let i = 0; i < totalEntries; i++) {
    const timestamp = new Date(now.getTime() - i * intervalHours * 60 * 60 * 1000);
    
    // Only keep data from last 3 months
    if (timestamp < threeMonthsAgo) {
      break;
    }
    
    const randomVariance = (Math.random() - 0.5) * variance;
    const value = parseFloat((baseValue + randomVariance).toFixed(1));
    
    // Determine status based on parameter type
    let status = 'good';
    
    // Simple status logic (can be customized per parameter)
    if (Math.abs(randomVariance) > variance * 0.7) {
      status = 'warning';
    }
    if (Math.abs(randomVariance) > variance * 0.85) {
      status = 'danger';
    }
    
    history.push({
      timestamp,
      value,
      unit,
      status,
    });
  }
  
  return history;
};

// Generate overall quality score history
export const generateOverallHistory = () => {
  const history = [];
  const now = new Date();
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  const intervalHours = 6;
  const totalEntries = Math.floor((3 * 30 * 24) / intervalHours);
  
  for (let i = 0; i < totalEntries; i++) {
    const timestamp = new Date(now.getTime() - i * intervalHours * 60 * 60 * 1000);
    
    if (timestamp < threeMonthsAgo) {
      break;
    }
    
    // Generate score between 80-95
    const randomVariance = (Math.random() - 0.5) * 15;
    const value = parseFloat((92 + randomVariance).toFixed(0));
    
    let status = 'good';
    
    if (value < 85) {
      status = 'warning';
    }
    if (value < 75) {
      status = 'danger';
    }
    
    history.push({
      timestamp,
      value,
      unit: 'Skor',
      status,
    });
  }
  
  return history;
};

// Overall quality data
export const getOverallQualityData = () => ({
  id: 0,
  title: 'Kualitas Air Overall',
  value: '92',
  unit: 'Skor',
  status: 'good',
  color: ['#4ADE80', '#22C55E'],
  history: generateOverallHistory(),
});

// Water quality parameters data
export const getQualityData = () => [
  {
    id: 1,
    title: 'pH Level',
    value: '7.2',
    unit: 'pH',
    status: 'good',
    iconName: 'water',
    range: '0-14',
    accuracy: '±0.1 pH',
    color: ['#7CB9D8', '#5AA3C8'],
    history: generateHistory(7.2, 'pH', 1.5),
  },
  {
    id: 2,
    title: 'Suhu Air',
    value: '22.5',
    unit: '°C',
    status: 'good',
    iconName: 'thermometer',
    range: '-10 to +85°C',
    accuracy: '±0.5°C',
    color: ['#B8DAE8', '#7CB9D8'],
    history: generateHistory(22.5, '°C', 3),
  },
  {
    id: 3,
    title: 'Padatan Terlarut',
    value: '245',
    unit: 'ppm',
    status: 'good',
    iconName: 'flask',
    range: '0-1000',
    accuracy: '±10% F.S.',
    color: ['#5AA3C8', '#3E8FB8'],
    history: generateHistory(245, 'ppm', 50),
  },
  {
    id: 4,
    title: 'Kekeruhan',
    value: '2.8',
    unit: 'NTU',
    status: 'good',
    iconName: 'eyedrop',
    range: '0-4.5V',
    accuracy: '±85%',
    color: ['#7CB9D8', '#5AA3C8'],
    history: generateHistory(2.8, 'NTU', 0.8),
  },
];