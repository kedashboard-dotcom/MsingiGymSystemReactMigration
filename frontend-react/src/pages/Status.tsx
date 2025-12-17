import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, User, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiService from '../services/api';

const Status: React.FC = () => {
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const params = data.membership_id 
        ? { membership_id: data.membership_id }
        : { phone: data.phone };

      const response = await apiService.checkStatus(params);
      if (response.status === 'success') {
        setMember(response.data.user);
        toast.success('Member found!');
      } else {
        toast.error('Member not found');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Check Membership Status</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block mb-2">Membership ID</label>
              <input {...register('membership_id')} className="input-field" placeholder="GYM001A1B2C" />
            </div>
            <div className="text-center">OR</div>
            <div>
              <label className="block mb-2">Phone Number</label>
              <input {...register('phone')} className="input-field" placeholder="07XX XXX XXX" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Checking...' : <><Search className="inline mr-2" /> Check Status</>}
            </button>
          </form>
        </div>

        <div>
          {member ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Membership Details</h2>
                {member.status === 'active' ? 
                  <CheckCircle className="text-green-600" /> : 
                  <XCircle className="text-red-600" />
                }
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold">{member.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Membership ID</p>
                    <p className="font-semibold font-mono">{member.membership_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold">{member.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Expiry Date</p>
                    <p className="font-semibold">
                      {new Date(member.membership_end).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Days Remaining</p>
                    <p className={`text-2xl font-bold ${
                      member.days_remaining > 7 ? 'text-green-600' : 
                      member.days_remaining > 0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {member.days_remaining}
                    </p>
                  </div>
                </div>

                {member.status !== 'active' && (
                  <a href="/renew" className="btn-primary block text-center">
                    Renew Membership
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 p-8 rounded-lg text-center">
              <Search className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Enter membership details to check status</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Status;