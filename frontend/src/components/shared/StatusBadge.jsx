import React from 'react';

const StatusBadge = ({ status }) => {
  const normalized = status?.toLowerCase() || '';

  const styles = {
    active: 'bg-green-100 text-green-700',
    paid: 'bg-green-100 text-green-700',
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-orange-100 text-orange-700',
    processing: 'bg-orange-100 text-orange-700',
    expired: 'bg-gray-100 text-gray-700',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  const style = styles[normalized] || 'bg-gray-100 text-gray-700';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  );
};

export default StatusBadge;
