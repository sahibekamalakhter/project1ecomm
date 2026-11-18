import React from "react";

const AddToCartPopup = ({ product, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="w-full max-w-md rounded border border-blue-200 bg-white p-6">
        <h2 className="mb-3 text-xl font-bold text-blue-900">
          Add This Product to Cart?
        </h2>
        <p className="mb-5 text-blue-900">
          Are you sure you want to add <strong>{product.name}</strong> to your cart?
        </p>
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
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartPopup;
