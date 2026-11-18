import React from "react";

const OrderSuccessPopup = ({ orderId, totalAmount, onOk }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="w-full max-w-md rounded border border-blue-200 bg-white p-6 text-center">
        <h2 className="mb-3 text-2xl font-bold text-blue-900">Order Placed Successfully!</h2>
        <p className="mb-4 text-blue-900">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <div className="mb-5 space-y-2 rounded border border-blue-100 bg-blue-50 p-3 text-blue-900">
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
        </div>
        <button
          type="button"
          onClick={onOk}
          className="rounded border border-blue-900 bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPopup;
