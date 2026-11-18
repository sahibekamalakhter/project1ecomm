import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import ConfirmOrderPopup from "../components/ConfirmOrderPopup";
import OrderSuccessPopup from "../components/OrderSuccessPopup";

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();
  const { token, user, isLoggedIn, cartItems, setCartItems } = useContext(AuthContext);

  function getImageUrl(image) {
    if (image && image.startsWith("/uploads")) {
      return "http://localhost:8001" + image;
    }
    return image;
  }

  async function getCart() {
    if (!token || !isLoggedIn) {
      toast.error("Please login to view cart");
      navigate("/login");
      return;
    }

    if (user && user.role !== "buyer") {
      toast.error("Only buyers can access cart");
      navigate("/");
      return;
    }

    try {
      const result = await axios.get("http://localhost:8001/cart/get", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      setCartItems(result.data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Could not fetch cart");
      }
    }
  }

  async function handleRemove(productId) {
    try {
      const result = await axios.delete(
        "http://localhost:8001/cart/remove/" + productId,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (result.data.success) {
        setCartItems(result.data.data);
        toast.success("Product removed from cart");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Could not remove product");
      }
    }
  }

  function getTotalPrice() {
    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].productId) {
        total = total + cartItems[i].productId.price * cartItems[i].quantity;
      }
    }
    return total;
  }

  function getTotalQuantity() {
    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
      total = total + cartItems[i].quantity;
    }
    return total;
  }

  function getProductCount() {
    return cartItems.length;
  }

  async function handleConfirmOrder() {
    try {
      const result = await axios.post(
        "http://localhost:8001/order/create",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (result.data.success) {
        setShowConfirmPopup(false);
        setOrderData(result.data.data);
        setCartItems([]);
        setShowSuccessPopup(true);
      }
    } catch (err) {
      setShowConfirmPopup(false);
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Could not place order");
      }
    }
  }

  function handleSuccessOk() {
    setShowSuccessPopup(false);
    setOrderData(null);
    navigate("/");
  }

  useEffect(() => {
    getCart();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-white px-4 py-8 sm:px-8">
        <h1 className="text-3xl font-bold text-blue-900">My Cart</h1>
        <p className="mt-4 text-blue-900">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white px-4 py-8 sm:px-8">
      <h1 className="mb-6 text-3xl font-bold text-blue-900">My Cart</h1>

      {cartItems.length === 0 && <p className="text-blue-900">Your cart is empty.</p>}

      <div className="flex flex-col gap-4">
        {cartItems.map((item) => {
          if (!item.productId) {
            return null;
          }

          const itemTotal = item.productId.price * item.quantity;

          return (
            <div
              className="flex max-w-3xl flex-col gap-4 rounded border border-blue-200 bg-blue-50 p-4 sm:flex-row"
              key={item._id}
            >
              <img
                src={getImageUrl(item.productId.image)}
                alt={item.productId.name}
                className="h-28 w-28 rounded border border-blue-200 bg-white object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-900">{item.productId.name}</h3>
                <p className="text-blue-900">Price: ₹{item.productId.price}</p>
                <p className="text-blue-900">Quantity: {item.quantity}</p>
                <p className="font-semibold text-blue-900">Total Item Price: ₹{itemTotal}</p>
                <button
                  onClick={() => handleRemove(item.productId._id)}
                  className="mt-2 rounded border border-blue-900 bg-white px-4 py-2 text-blue-900 hover:bg-blue-100"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {cartItems.length > 0 && (
        <div className="mt-6 max-w-3xl rounded border border-blue-200 bg-white p-4">
          <h2 className="text-xl font-bold text-blue-900">
            Total Cart Amount: ₹{getTotalPrice()}
          </h2>
          <button
            onClick={() => setShowConfirmPopup(true)}
            className="mt-4 rounded border border-blue-900 bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Proceed to Buy
          </button>
        </div>
      )}

      {showConfirmPopup && (
        <ConfirmOrderPopup
          productCount={getProductCount()}
          totalQuantity={getTotalQuantity()}
          totalAmount={getTotalPrice()}
          onConfirm={handleConfirmOrder}
          onCancel={() => setShowConfirmPopup(false)}
        />
      )}

      {showSuccessPopup && orderData && (
        <OrderSuccessPopup
          orderId={orderData.orderId}
          totalAmount={orderData.totalAmount}
          onOk={handleSuccessOk}
        />
      )}
    </div>
  );
};

export default Cart;
