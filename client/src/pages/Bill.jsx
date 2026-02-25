import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate } from '../utils/formatDate.js';

export const Bill = ({ billData }) => {
  if (!billData) {
    return <div>No bill data</div>;
  }

  const total = billData.items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h1 className="text-center text-2xl font-bold mb-4">Kiran Dairy Farm</h1>
      <hr className="mb-4" />

      <div className="text-center mb-4">
        <p className="font-semibold">Bill No: {billData.billNo}</p>
        <p className="text-sm text-gray-600">{formatDate(billData.saleDate)}</p>
      </div>

      <hr className="my-4" />

      <table className="w-full text-sm mb-4">
        <thead>
          <tr>
            <th className="text-left">Item</th>
            <th className="text-center">Qty</th>
            <th className="text-right">Price</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {billData.items.map((item, idx) => (
            <tr key={idx} className="border-b">
              <td>{item.productName}</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-right">{formatCurrency(item.price)}</td>
              <td className="text-right">{formatCurrency(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr className="my-4" />

      <div className="flex justify-between font-bold text-lg mb-4">
        <span>Total:</span>
        <span>{formatCurrency(total)}</span>
      </div>

      <p className="text-center text-sm text-gray-600">
        Payment: {billData.paymentMethod}
      </p>

      <hr className="my-4" />

      <p className="text-center text-xs text-gray-500">
        Thank you for your business!
      </p>
    </div>
  );
};
