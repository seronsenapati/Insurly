export const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

export const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A';

export const formatTriggerType = (type) => type ? type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';

export const getTriggerIcon = (type) => ({
  heavy_rain: 'rainy',
  extreme_heat: 'sunny',
  cyclone_storm: 'thunderstorm',
  severe_pollution: 'air',
  zone_lockdown: 'block'
})[type] || 'help';
