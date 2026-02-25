import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card.jsx';
import { adminApi } from '../../api/adminApi.js';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalShops: 0,
    totalStock: 0,
    totalDispatches: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await adminApi.getDashboard();
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-3 gap-6">
        <Card title="Total Shops">
          <p className="text-4xl font-bold text-blue-600">{stats.totalShops}</p>
          <p className="text-gray-600">Active branches</p>
        </Card>
        
        <Card title="Total Stock">
          <p className="text-4xl font-bold text-green-600">{stats.totalStock}</p>
          <p className="text-gray-600">Units in inventory</p>
        </Card>
        
        <Card title="Total Dispatches">
          <p className="text-4xl font-bold text-purple-600">{stats.totalDispatches}</p>
          <p className="text-gray-600">Completed dispatches</p>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <p className="text-gray-600">No recent activity</p>
      </Card>
    </div>
  );
};
