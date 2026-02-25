import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card.jsx';
import { DataTable } from '../../components/common/DataTable.jsx';
import { shopApi } from '../../api/shopApi.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await shopApi.getInventory();
        setInventory(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const columns = [
    { key: 'productName', label: 'Product Name', render: (val, row) => row.productId?.name },
    { key: 'quantity', label: 'Quantity' },
    { key: 'price', label: 'Price', render: (val, row) => formatCurrency(row.productId?.price) },
    { key: 'status', label: 'Status', render: (val, row) => row.quantity > 0 ? '✓ In Stock' : '✗ Out of Stock' }
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Inventory</h1>

      <Card>
        <DataTable columns={columns} data={inventory} />
      </Card>
    </div>
  );
};
