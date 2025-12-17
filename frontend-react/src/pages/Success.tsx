import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle, Download, Printer } from 'lucide-react';
import { usePayment } from '../contexts/PaymentContext';

const Success: React.FC = () => {
  const location = useLocation();
  const { pollPaymentStatus } = usePayment();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    const data = location.state || {};
    setPaymentData(data);

    if (data.checkout_request_id) {
      pollPaymentStatus(data.checkout_request_id).then(result => {
        setStatus(result.success ? 'success' : 'failed');
      });
    }
  }, [location]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>

      <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-xl text-gray-600 mb-8">Your membership has been activated</p>

      {paymentData && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Membership ID:</span>
              <span className="font-bold">{paymentData.membership_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-bold text-green-600">Active</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <button className="flex items-center justify-center space-x-2 border-2 border-gray-300 py-3 px-4 rounded-lg">
          <Printer className="w-5 h-5" />
          <span>Print Card</span>
        </button>
        <button className="flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 px-4 rounded-lg">
          <Download className="w-5 h-5" />
          <span>Download App</span>
        </button>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-bold mb-2">Next Steps</h3>
        <ul className="text-left space-y-2">
          <li>• Visit gym with your membership ID</li>
          <li>• Collect your RFID card at reception</li>
          <li>• Schedule orientation with trainer</li>
        </ul>
      </div>
    </div>
  );
};

export default Success;