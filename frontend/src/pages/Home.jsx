import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import AddToCartPopup from "../components/AddToCartPopup";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const { isLoggedIn, user, token } = useContext(AuthContext);

  async function getProducts() {
    try {
      const result = await axios.get("http://localhost:8001/product/getAll");
      setProducts(result.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch products");
      setLoading(false);
    }
  }

  function getImageUrl(image) {
    if (image && image.startsWith("/uploads")) {
      return "http://localhost:8001" + image;
    }
    return image;
  }

  function handleAddToCartClick(product) {
    setSelectedProduct(product);
    setShowPopup(true);
  }

  async function handleConfirmAddToCart() {
    if (!token || !isLoggedIn) {
      setShowPopup(false);
      toast.error("Please login to add products to cart");
      navigate("/login");
      return;
    }

    if (user && user.role !== "buyer") {
      setShowPopup(false);
      toast.error("Only buyers can add products to cart");
      return;
    }

    if (user && user.isVerified === false) {
      setShowPopup(false);
      toast.error("Please verify your email before adding products to cart");
      return;
    }

    try {
      const result = await axios.post(
        "http://localhost:8001/cart/add",
        { productId: selectedProduct._id },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (result.data.success) {
        toast.success("Product added to cart");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Could not add product to cart");
      }
    }

    setShowPopup(false);
    setSelectedProduct(null);
  }

  function handleCancelPopup() {
    setShowPopup(false);
    setSelectedProduct(null);
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white px-4 py-8 sm:px-8">
      <h1 className="mb-6 text-3xl font-bold text-blue-900">Products</h1>
      {loading && <p className="text-blue-900">Loading products...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-blue-900">No products available.</p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div
            className="rounded border border-blue-200 bg-blue-50 p-4"
            key={product._id}
          >
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="mb-3 h-40 w-full rounded border border-blue-200 bg-white object-cover"
            />
            <h3 className="text-lg font-bold text-blue-900">{product.name}</h3>
            <p className="mt-1 text-sm text-blue-900">{product.description}</p>
            <p className="mt-2 font-semibold text-blue-900">Price: ₹{product.price}</p>
            {(!user || user.role === "buyer") && (
              <button
                onClick={() => handleAddToCartClick(product)}
                className="mt-3 w-full rounded border border-blue-900 bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
              >
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>

      {showPopup && selectedProduct && (
        <AddToCartPopup
          product={selectedProduct}
          onConfirm={handleConfirmAddToCart}
          onCancel={handleCancelPopup}
        />
      )}
    </div>
  );
};

export default Home;
