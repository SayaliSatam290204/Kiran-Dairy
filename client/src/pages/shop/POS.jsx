import { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Skeleton } from "../../components/ui/Skeleton.jsx";
import { shopApi } from "../../api/shopApi.js";
import { salesApi } from "../../api/salesApi.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { Bill } from "../Bill.jsx"; // correct path: src/pages/Bill.jsx

export const POS = () => {
  const [products, setProducts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // confirm remove from cart
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);

  // bill preview after sale
  const [billOpen, setBillOpen] = useState(false);
  const [saleData, setSaleData] = useState(null);

  // Function to refresh products after sale
  const refreshProducts = async () => {
    try {
      const response = await shopApi.getInventory();
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Failed to refresh products:", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await shopApi.getInventory();
        setProducts(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error(error.response?.data?.message || "Failed to load products");
      } finally {
        setPageLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const stockByProductId = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      const id = p.productId?._id;
      if (id) map.set(id, p.quantity || 0);
    });
    return map;
  }, [products]);

  const addToCart = (product) => {
    const pid = product.productId?._id;
    if (!pid) return;

    const availableStock = stockByProductId.get(pid) ?? 0;
    if (availableStock <= 0) {
      toast.error("Out of stock");
      return;
    }

    const existing = cart.find((item) => item.productId === pid);

    if (existing) {
      if (existing.quantity + 1 > availableStock) {
        toast.error("Not enough stock");
        return;
      }

      setCart(
        cart.map((item) =>
          item.productId === pid ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: pid,
          productName: product.productId?.name,
          price: product.productId?.price || 0,
          quantity: 1,
        },
      ]);
      toast.success("Added to cart");
    }
  };

  const askRemoveFromCart = (productId) => {
    setRemoveTarget(productId);
    setConfirmRemoveOpen(true);
  };

  const removeFromCart = () => {
    setCart(cart.filter((item) => item.productId !== removeTarget));
    setRemoveTarget(null);
    setConfirmRemoveOpen(false);
    toast.success("Removed from cart");
  };

  const updateQuantity = (productId, quantity) => {
    const availableStock = stockByProductId.get(productId) ?? 0;

    if (quantity <= 0) {
      askRemoveFromCart(productId);
      return;
    }

    if (quantity > availableStock) {
      toast.error("Quantity exceeds stock");
      return;
    }

    setCart(cart.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Cart is empty");

    setLoading(true);

    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.productName, // helpful for bill
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: getTotal(),
        paymentMethod,
      };

      const res = await salesApi.create(payload);

      toast.success("Sale completed!");

      // Normalize bill data so Bill.jsx always works
      const sale = res.data?.data || payload;

      const normalized = {
        ...sale,
        billNo: sale.billNo || sale.billNumber || "BILL",
        saleDate: sale.saleDate || sale.createdAt || new Date().toISOString(),
        paymentMethod: sale.paymentMethod || paymentMethod,
        items: (sale.items || payload.items || []).map((it) => ({
          ...it,
          productName:
            it.productName ||
            cart.find((c) => c.productId === it.productId)?.productName ||
            "Item",
          subtotal: it.subtotal ?? (it.price || 0) * (it.quantity || 0),
        })),
      };

      setSaleData(normalized);

      setCart([]);
      setIsCheckoutOpen(false);
      setPaymentMethod("cash");

      // Refresh products to show updated quantities
      await refreshProducts();

      // open bill preview
      setBillOpen(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">POS Billing</h1>

      {pageLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Skeleton className="h-96 w-full" />
          </div>
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Products */}
          <div className="lg:col-span-3">
            <Card title="Available Products">
              {products.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-lg font-semibold">No products available</div>
                  <p className="text-gray-600 text-sm mt-1">Wait for dispatch stock.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => {
                    const qty = product.quantity || 0;
                    const out = qty <= 0;

                    return (
                      <div
                        key={product._id}
                        className={`border p-4 rounded-lg transition ${
                          out ? "opacity-60 cursor-not-allowed bg-gray-50" : "hover:shadow-md cursor-pointer"
                        }`}
                        onClick={() => !out && addToCart(product)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{product.productId?.name}</p>
                            <p className="text-sm text-gray-600">Qty: {qty}</p>
                          </div>
                          {out ? <Badge variant="red">OUT</Badge> : <Badge variant="green">IN</Badge>}
                        </div>

                        <p className="text-lg font-bold text-green-600 mt-2">
                          {formatCurrency(product.productId?.price || 0)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Cart */}
          <div>
            <Card title="Cart">
              <div className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-lg font-semibold">Cart is empty</div>
                    <p className="text-gray-600 text-sm mt-1">Click a product to add it.</p>
                  </div>
                ) : (
                  <>
                    {cart.map((item) => {
                      const availableStock = stockByProductId.get(item.productId) ?? 0;

                      return (
                        <div key={item.productId} className="border-b pb-4">
                          <div className="flex items-start justify-between">
                            <p className="font-semibold text-sm">{item.productName}</p>
                            <button
                              onClick={() => askRemoveFromCart(item.productId)}
                              className="text-red-600 text-sm hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>

                          <p className="text-xs text-gray-500 mt-1">Stock: {availableStock}</p>

                          <div className="flex gap-2 items-center my-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                              className="w-20 px-2 py-1 border rounded"
                            />
                            {item.quantity >= availableStock && <Badge variant="red">MAX</Badge>}
                          </div>

                          <p className="text-sm">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      );
                    })}

                    <div className="border-t pt-4 mt-4">
                      <p className="font-bold text-lg">{formatCurrency(getTotal())}</p>
                      <Button
                        onClick={() => setIsCheckoutOpen(true)}
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
      )}

      {/* Checkout Modal */}
      <Modal isOpen={isCheckoutOpen} title="Confirm Payment" onClose={() => setIsCheckoutOpen(false)}>
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
              disabled={loading}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="online">Online</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>

          <Button onClick={handleCheckout} loading={loading} className="w-full">
            Complete Payment
          </Button>
        </div>
      </Modal>

      {/* Confirm Remove Modal */}
      <Modal isOpen={confirmRemoveOpen} title="Remove Item?" onClose={() => setConfirmRemoveOpen(false)}>
        <p className="text-gray-700 mb-4">Do you want to remove this item from cart?</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirmRemoveOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={removeFromCart}>
            Remove
          </Button>
        </div>
      </Modal>

      {/* Bill Preview Modal */}
      <Modal isOpen={billOpen} title="Bill Preview" onClose={() => setBillOpen(false)}>
        <Bill billData={saleData} />
        <div className="mt-4">
          <Button className="w-full" onClick={() => window.print()}>
            Print Bill
          </Button>
        </div>
      </Modal>
    </div>
  );
};