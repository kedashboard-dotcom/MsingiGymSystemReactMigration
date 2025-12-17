import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import apiService from '../services/api';

interface PaymentContextType {
  initiatePayment: (data: any, type: 'registration' | 'renewal') => Promise<any>;
  checkPaymentStatus: (checkoutId: string) => Promise<any>;
  pollPaymentStatus: (checkoutId: string) => Promise<any>;
  isProcessing: boolean;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
};

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const initiatePayment = async (data: any, type: 'registration' | 'renewal') => {
    setIsProcessing(true);
    try {
      const endpoint = type === 'registration' 
        ? apiService.registerMember 
        : apiService.renewMembership;

      const response = await endpoint(data);
      
      if (response.status === 'success') {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async (checkoutId: string) => {
    try {
      return await apiService.checkPaymentStatus(checkoutId);
    } catch (error: any) {
      throw error;
    }
  };

  const pollPaymentStatus = async (checkoutId: string) => {
    return new Promise((resolve) => {
      const poll = async (attempts = 0) => {
        if (attempts >= 30) {
          resolve({ success: false, message: 'Timeout' });
          return;
        }

        try {
          const status = await checkPaymentStatus(checkoutId);
          if (status.data?.ResultCode === '0') {
            resolve({ success: true, data: status.data });
          } else if (status.data?.ResultCode === '1') {
            setTimeout(() => poll(attempts + 1), 5000);
          } else {
            resolve({ success: false, message: status.data?.ResultDesc });
          }
        } catch {
          setTimeout(() => poll(attempts + 1), 5000);
        }
      };

      poll();
    });
  };

  return (
    <PaymentContext.Provider value={{
      initiatePayment,
      checkPaymentStatus,
      pollPaymentStatus,
      isProcessing
    }}>
      {children}
    </PaymentContext.Provider>
  );
};