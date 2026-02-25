import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card.jsx';
import { DataTable } from '../../components/common/DataTable.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

export const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch reports data
    setLoading(false);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card title="Sales Report">
          <p className="text-gray-600 text-center py-8">No data available</p>
        </Card>
        
        <Card title="Inventory Report">
          <p className="text-gray-600 text-center py-8">No data available</p>
        </Card>
      </div>

      <Card title="Detailed Reports">
        <p className="text-gray-600 text-center py-8">Reports will be displayed here</p>
      </Card>
    </div>
  );
};
