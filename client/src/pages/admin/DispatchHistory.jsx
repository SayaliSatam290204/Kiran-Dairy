import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card.jsx';
import { DataTable } from '../../components/common/DataTable.jsx';
import { adminApi } from '../../api/adminApi.js';
import { formatDate } from '../../utils/formatDate.js';

export const DispatchHistory = () => {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDispatches = async () => {
      try {
        const response = await adminApi.getDispatches();
        setDispatches(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch dispatches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDispatches();
  }, []);

  const columns = [
    { key: 'dispatchNo', label: 'Dispatch No' },
    { key: 'shopName', label: 'Shop', render: (val, row) => row.shopId?.name },
    { key: 'status', label: 'Status' },
    { key: 'dispatchDate', label: 'Date', render: (val) => formatDate(val) }
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dispatch History</h1>

      <Card>
        <DataTable columns={columns} data={dispatches} />
      </Card>
    </div>
  );
};
