import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { adminApi } from '../../api/adminApi.js';
import { dispatchApi } from '../../api/dispatchApi.js';

export const CreateDispatch = () => {
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [dispatchItems, setDispatchItems] = useState([{ productId: '', quantity: 0 }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shopsRes = await adminApi.getShops();
        const productsRes = await adminApi.getProducts();
        setShops(shopsRes.data.data || []);
        setProducts(productsRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = () => {
    setDispatchItems([...dispatchItems, { productId: '', quantity: 0 }]);
  };

  const handleRemoveItem = (index) => {
    setDispatchItems(dispatchItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        shopId: selectedShop,
        items: dispatchItems
      };

      await dispatchApi.create(payload);
      alert('Dispatch created successfully');
      setSelectedShop('');
      setDispatchItems([{ productId: '', quantity: 0 }]);
    } catch (error) {
      alert('Failed to create dispatch: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create Dispatch</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Shop</label>
            <select
              value={selectedShop}
              onChange={(e) => setSelectedShop(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Shop --</option>
              {shops.map((shop) => (
                <option key={shop._id} value={shop._id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Dispatch Items</h3>
            {dispatchItems.map((item, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <select
                  value={item.productId}
                  onChange={(e) => {
                    const newItems = [...dispatchItems];
                    newItems[index].productId = e.target.value;
                    setDispatchItems(newItems);
                  }}
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">-- Select Product --</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>

                <Input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...dispatchItems];
                    newItems[index].quantity = parseInt(e.target.value) || 0;
                    setDispatchItems(newItems);
                  }}
                  className="w-24"
                />

                {dispatchItems.length > 1 && (
                  <Button onClick={() => handleRemoveItem(index)} variant="danger">
                    Remove
                  </Button>
                )}
              </div>
            ))}

            <Button type="button" onClick={handleAddItem} variant="secondary" className="mb-4">
              + Add Item
            </Button>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Dispatch'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
