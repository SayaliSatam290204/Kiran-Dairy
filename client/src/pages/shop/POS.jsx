import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { shopApi } from '../../api/shopApi.js';
import { salesApi } from '../../api/salesApi.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export const POS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await shopApi.getInventory();
        setProducts(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product.productId?._id);

    if (existing) {
      setCart(cart.map(item =>
        item.productId === product.productId?._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.productId?._id,
        productName: product.productId?.name,
        price: product.productId?.price,
        quantity: 1
      }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const payload = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getTotal(),
        paymentMethod
      };

      await salesApi.create(payload);
      alert('Sale completed successfully!');
      setCart([]);
      setIsModalOpen(false);
      setPaymentMethod('cash');
    } catch (error) {
      alert('Failed to complete sale: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">POS Billing</h1>

      <div className="grid grid-cols-4 gap-6">
        {/* Products */}
        <div className="col-span-3">
          <Card title="Available Products">
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <div key={product._id} className="border p-4 rounded hover:shadow-lg cursor-pointer"
                  onClick={() => addToCart(product)}>
                  <p className="font-semibold">{product.productId?.name}</p>
                  <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(product.productId?.price)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Cart */}
        <div>
          <Card title="Cart">
            <div className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Cart is empty</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.productId} className="border-b pb-4">
                      <p className="font-semibold text-sm">{item.productName}</p>
                      <div className="flex gap-2 my-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                          className="w-12 px-2 py-1 border rounded"
                        />
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-sm">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}

                  <div className="border-t pt-4 mt-4">
                    <p className="font-bold text-lg">{formatCurrency(getTotal())}</p>
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      disabled={cart.length === 0}
                      className="w-full mt-2"
                    >
                      Checkout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal isOpen={isModalOpen} title="Confirm Payment" onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold">{formatCurrency(getTotal())}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="online">Online</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>

          <Button onClick={handleCheckout} disabled={loading} className="w-full">
            {loading ? 'Processing...' : 'Complete Payment'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
