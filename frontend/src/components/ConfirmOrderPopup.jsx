import React from "react";

const ConfirmOrderPopup = ({ productCount, totalQuantity, totalAmount, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="w-full max-w-md rounded border border-blue-200 bg-white p-6">
        <h2 className="mb-3 text-xl font-bold text-blue-900">Confirm Your Order</h2>
        <p className="mb-4 text-blue-900">Are you sure you want to place this order?</p>

        <div className="mb-5 space-y-2 rounded border border-blue-100 bg-blue-50 p-3 text-blue-900">
          <p><strong>Number of products:</strong> {productCount}</p>
          <p><strong>Total quantity:</strong> {totalQuantity}</p>
          <p><strong>Total amount:</strong> ₹{totalAmount}</p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-blue-900 bg-white px-4 py-2 text-blue-900 hover:bg-blue-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded border border-blue-900 bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderPopup;
