import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card.jsx';
import { DataTable } from '../../components/common/DataTable.jsx';
import { ledgerApi } from '../../api/ledgerApi.js';
import { formatDate } from '../../utils/formatDate.js';

export const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await ledgerApi.getAll();
        setLogs(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const columns = [
    { key: 'shopName', label: 'Shop', render: (val, row) => row.shopId?.name },
    { key: 'productName', label: 'Product', render: (val, row) => row.productId?.name },
    { key: 'transactionType', label: 'Type' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'transactionDate', label: 'Date', render: (val) => formatDate(val) }
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Stock Ledger (Admin Logs)</h1>

      <Card>
        <DataTable columns={columns} data={logs} />
      </Card>
    </div>
  );
};
