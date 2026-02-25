import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card.jsx';
import { DataTable } from '../../components/common/DataTable.jsx';
import { salesApi } from '../../api/salesApi.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

export const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await salesApi.getHistory();
        setSales(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch sales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const columns = [
    { key: 'billNo', label: 'Bill No' },
    { key: 'totalAmount', label: 'Amount', render: (val) => formatCurrency(val) },
    { key: 'paymentMethod', label: 'Payment' },
    { key: 'saleDate', label: 'Date', render: (val) => formatDate(val) }
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Sales History</h1>

      <Card>
        <DataTable columns={columns} data={sales} />
      </Card>
    </div>
  );
};
