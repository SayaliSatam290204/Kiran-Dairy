import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card.jsx';
import { DataTable } from '../../components/common/DataTable.jsx';
import { returnApi } from '../../api/returnApi.js';
import { formatDate } from '../../utils/formatDate.js';

export const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const response = await returnApi.getAll();
        setReturns(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch returns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  const columns = [
    { key: 'returnNo', label: 'Return No' },
    { key: 'status', label: 'Status' },
    { key: 'totalRefund', label: 'Refund' },
    { key: 'returnDate', label: 'Date', render: (val) => formatDate(val) }
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Returns</h1>

      <Card>
        <DataTable columns={columns} data={returns} />
      </Card>
    </div>
  );
};
