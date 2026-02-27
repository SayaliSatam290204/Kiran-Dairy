import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Card } from "../../components/ui/Card.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Skeleton } from "../../components/ui/Skeleton.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { adminApi } from "../../api/adminApi.js";
import { dispatchApi } from "../../api/dispatchApi.js";

export const CreateDispatch = () => {
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [dispatchItems, setDispatchItems] = useState([{ productId: "", quantity: 0 }]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // confirm remove item modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removeIndex, setRemoveIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopsRes, productsRes] = await Promise.all([adminApi.getShops(), adminApi.getProducts()]);
        setShops(shopsRes.data.data || []);
        setProducts(productsRes.data.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error(error.response?.data?.message || "Failed to load shops/products");
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = () => {
    setDispatchItems([...dispatchItems, { productId: "", quantity: 0 }]);
  };

  const askRemoveItem = (index) => {
    setRemoveIndex(index);
    setConfirmOpen(true);
  };

  const confirmRemoveItem = () => {
    if (removeIndex === null) return;
    setDispatchItems(dispatchItems.filter((_, i) => i !== removeIndex));
    setRemoveIndex(null);
    setConfirmOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // simple validation: prevent zero qty
    const invalid = dispatchItems.some((it) => !it.productId || !it.quantity || it.quantity <= 0);
    if (!selectedShop) return toast.error("Please select a shop");
    if (invalid) return toast.error("Please select product and quantity (> 0) for all items");

    setLoading(true);

    try {
      const payload = { shopId: selectedShop, items: dispatchItems };
      await dispatchApi.create(payload);

      toast.success("Dispatch created successfully");
      setSelectedShop("");
      setDispatchItems([{ productId: "", quantity: 0 }]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create dispatch");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Create Dispatch</h1>
        <Card>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </div>
    );
  }

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
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
              <div key={index} className="flex flex-col md:flex-row gap-3 mb-4">
                <select
                  value={item.productId}
                  onChange={(e) => {
                    const newItems = [...dispatchItems];
                    newItems[index].productId = e.target.value;
                    setDispatchItems(newItems);
                  }}
                  required
                  disabled={loading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
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
                  disabled={loading}
                  onChange={(e) => {
                    const newItems = [...dispatchItems];
                    newItems[index].quantity = parseInt(e.target.value) || 0;
                    setDispatchItems(newItems);
                  }}
                  className="w-full md:w-32"
                />

                {dispatchItems.length > 1 && (
                  <Button type="button" onClick={() => askRemoveItem(index)} variant="danger" disabled={loading}>
                    Remove
                  </Button>
                )}
              </div>
            ))}

            <Button type="button" onClick={handleAddItem} variant="secondary" className="mb-4" disabled={loading}>
              + Add Item
            </Button>
          </div>

          <Button type="submit" loading={loading} className="w-full">
            Create Dispatch
          </Button>
        </form>
      </Card>

      <Modal isOpen={confirmOpen} title="Remove Item?" onClose={() => setConfirmOpen(false)}>
        <p className="text-gray-700 mb-4">Do you want to remove this dispatch item?</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmRemoveItem}>
            Remove
          </Button>
        </div>
      </Modal>
    </div>
  );
};