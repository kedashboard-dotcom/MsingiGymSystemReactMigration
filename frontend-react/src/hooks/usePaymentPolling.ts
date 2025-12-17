import { useCallback, useRef } from 'react';
import apiService from '../services/api';

export const usePaymentPolling = () => {
  const pollingRef = useRef<NodeJS.Timeout>();

  const startPolling = useCallback((
    checkoutId: string,
    onSuccess: (data: any) => void,
    onError: (error: any) => void,
    interval = 5000,
    maxAttempts = 60
  ) => {
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        onError({ message: 'Payment timeout' });
        return;
      }

      try {
        const response = await apiService.checkPaymentStatus(checkoutId);
        attempts++;

        if (response.data?.ResultCode === '0') {
          onSuccess(response.data);
        } else if (response.data?.ResultCode === '1') {
          pollingRef.current = setTimeout(poll, interval);
        } else {
          onError(response.data);
        }
      } catch (error) {
        attempts++;
        pollingRef.current = setTimeout(poll, interval);
      }
    };

    pollingRef.current = setTimeout(poll, interval);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
    }
  }, []);

  return { startPolling, stopPolling };
};