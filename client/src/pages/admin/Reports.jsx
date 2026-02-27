import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card.jsx";
import { Skeleton } from "../../components/ui/Skeleton.jsx";

export const Reports = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch reports data later
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-56 md:col-span-2" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card title="Sales Report">
              <div className="text-center py-8">
                <div className="text-lg font-semibold">No sales report yet</div>
                <p className="text-gray-600 text-sm mt-1">Sales report will appear once sales start.</p>
              </div>
            </Card>

            <Card title="Inventory Report">
              <div className="text-center py-8">
                <div className="text-lg font-semibold">No inventory report yet</div>
                <p className="text-gray-600 text-sm mt-1">Inventory report will appear once stock is available.</p>
              </div>
            </Card>
          </div>

          <Card title="Detailed Reports">
            <div className="text-center py-8">
              <div className="text-lg font-semibold">Reports will be displayed here</div>
              <p className="text-gray-600 text-sm mt-1">This section can show filters + exports later.</p>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};