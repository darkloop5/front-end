import { useMemo } from 'react';

export const useUserLevel = (balance) => {
  return useMemo(() => {
    if (balance >= 20001) return { level: "Four", min: 20001 };
    if (balance >= 10001) return { level: "Three", min: 10001 };
    if (balance >= 5001)  return { level: "Two", min: 5001 };
    if (balance >= 1000)  return { level: "One", min: 1000 };
    
    return { level: "Basic", min: 0 };
  }, [balance]);
};