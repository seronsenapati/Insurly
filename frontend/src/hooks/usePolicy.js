import { useContext } from 'react';
import { PolicyContext } from '@/context/PolicyContext';

export const usePolicy = () => {
  const context = useContext(PolicyContext);
  if (!context) {
    throw new Error('usePolicy must be used within a PolicyProvider');
  }
  return context;
};
