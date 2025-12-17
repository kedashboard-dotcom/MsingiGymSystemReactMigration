import React, { useEffect, useState } from 'react';
import { Users, CreditCard, Activity, RefreshCw } from 'lucide-react';
import apiService from '../services/api';

const Admin: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, membersData] = await Promise.all([
        apiService.getSystemStats(),
        apiService.getActiveMembers()
      ]);
      setStats(statsData.data);
      setMembers(membersData.data?.members || []);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-primary-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Members</p>
              <p className="text-3xl font-bold">{stats?.total_members || 0}</p>
            </div>
            <Users className="text-primary-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Active Members</p>
              <p className="text-3xl font-bold">{stats?.active_members || 0}</p>
            </div>
            <Activity className="text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">AxtraxNG</p>
              <p className="text-3xl font-bold">
                {stats?.axtrax_enabled ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">M-Pesa</p>
              <p className="text-3xl font-bold">Active</p>
            </div>
            <CreditCard className="text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Active Members ({members.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Membership ID</th>
                <th className="px-6 py-3 text-left">Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member: any) => (
                <tr key={member.membership_id} className="border-t">
                  <td className="px-6 py-4">{member.name}</td>
                  <td className="px-6 py-4">{member.phone}</td>
                  <td className="px-6 py-4 font-mono">{member.membership_id}</td>
                  <td className="px-6 py-4">
                    {new Date(member.membership_end).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;