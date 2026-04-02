import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export const PolicyContext = createContext(null);

export const PolicyProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [activePolicy, setActivePolicy] = useState(null);
  const [isLoadingPolicy, setIsLoadingPolicy] = useState(true);

  const fetchActivePolicy = useCallback(async () => {
    if (!isAuthenticated || user?.role === 'admin') {
      setIsLoadingPolicy(false);
      setActivePolicy(null);
      return;
    }

    try {
      setIsLoadingPolicy(true);
      const res = await api.get('/policy/active');
      setActivePolicy(res.data.data);
    } catch (error) {
      console.error('Failed to fetch active policy:', error);
      setActivePolicy(null);
    } finally {
      setIsLoadingPolicy(false);
    }
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    fetchActivePolicy();
  }, [fetchActivePolicy]);

  const purchasePolicy = async (tier) => {
    const res = await api.post('/policy/purchase', { tier });
    setActivePolicy(res.data.data);
    return res.data;
  };

  return (
    <PolicyContext.Provider value={{ activePolicy, isLoadingPolicy, fetchActivePolicy, purchasePolicy }}>
      {children}
    </PolicyContext.Provider>
  );
};

export const usePolicy = () => useContext(PolicyContext);

