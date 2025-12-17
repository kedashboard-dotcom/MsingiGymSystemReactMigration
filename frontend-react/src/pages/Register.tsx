import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { usePayment } from '../contexts/PaymentContext';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone is required'),
  plan: yup.string().oneOf(['standard', 'premium', 'vip']).required(),
});

const Register: React.FC = () => {
  const { initiatePayment, isProcessing } = usePayment();
  const [step, setStep] = useState(1);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { plan: 'standard' }
  });

  const selectedPlan = watch('plan');

  const getPrice = () => {
    switch(selectedPlan) {
      case 'premium': return process.env.REACT_APP_PREMIUM_PRICE || '3';
      case 'vip': return process.env.REACT_APP_VIP_PRICE || '5';
      default: return process.env.REACT_APP_STANDARD_PRICE || '2';
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const result = await initiatePayment({
        name: data.name,
        phone: data.phone,
        amount: getPrice(),
        membership_type: data.plan
      }, 'registration');

      if (result.success) {
        toast.success('Payment request sent!');
        setStep(3);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Register Membership</h1>
      
      <div className="mb-8">
        <div className="flex justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200'
            }`}>
              {s}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Full Name</label>
              <input {...register('name')} className="input-field" />
              {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block mb-2">Phone Number</label>
              <input {...register('phone')} className="input-field" placeholder="07XX XXX XXX" />
              {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}
            </div>
            <button type="button" onClick={() => setStep(2)} className="btn-primary w-full">
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block mb-4">Select Plan</label>
              <div className="grid grid-cols-3 gap-4">
                {['standard', 'premium', 'vip'].map((plan) => (
                  <label key={plan} className={`
                    border-2 rounded p-4 text-center cursor-pointer
                    ${selectedPlan === plan ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}
                  `}>
                    <input type="radio" value={plan} {...register('plan')} className="hidden" />
                    <div className="capitalize font-semibold">{plan}</div>
                    <div className="text-lg font-bold">KSh {getPrice()}</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between mb-2">
                <span>Plan:</span>
                <span className="font-semibold capitalize">{selectedPlan}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>KSh {getPrice()}</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button type="button" onClick={() => setStep(1)} className="btn-primary flex-1 bg-gray-200 text-gray-800">
                Back
              </button>
              <button type="submit" disabled={isProcessing} className="btn-primary flex-1">
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Payment Request Sent!</h2>
            <p className="text-gray-600 mb-6">Check your phone for M-Pesa prompt</p>
            <a href="/status" className="btn-primary inline-block">
              Check Status
            </a>
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;