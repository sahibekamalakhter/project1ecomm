import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const Seller = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [fileKey, setFileKey] = useState(Date.now());
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const { token, user, isLoggedIn } = useContext(AuthContext);

  function getImageUrl(imagePath) {
    if (imagePath && imagePath.startsWith("/uploads")) {
      return "http://localhost:8001" + imagePath;
    }
    return imagePath;
  }

  async function getMyProducts() {
    try {
      const result = await axios.get("http://localhost:8001/product/myProducts", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setMyProducts(result.data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Could not fetch your products");
      }
    }
  }

  async function handleCreateProduct(e) {
    e.preventDefault();

    if (name === "" || description === "" || price === "" || !image) {
      toast.error("Please fill all fields and select a photo");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("image", image);

      const result = await axios.post(
        "http://localhost:8001/product/create",
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (result.data.success) {
        toast.success("Product listed successfully");
        setName("");
        setDescription("");
        setPrice("");
        setImage(null);
        setFileKey(Date.now());
        setShowForm(false);
        getMyProducts();
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Could not list product");
      }
    }
  }

  async function handleDelete(productId) {
    try {
      const result = await axios.delete(
        "http://localhost:8001/product/delete/" + productId,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (result.data.success) {
        toast.success("Product deleted successfully");
        getMyProducts();
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Could not delete product");
      }
    }
  }

  useEffect(() => {
    if (!token || !isLoggedIn) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (user && user.role !== "seller") {
      toast.error("Only sellers can access this page");
      navigate("/");
      return;
    }

    getMyProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-white px-4 py-8 sm:px-8">
        <h1 className="text-3xl font-bold text-blue-900">Seller Dashboard</h1>
        <p className="mt-4 text-blue-900">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white px-4 py-8 sm:px-8">
      <h1 className="mb-6 text-3xl font-bold text-blue-900">Seller Dashboard</h1>

      <div className="mb-8">
        <h2 className="mb-3 text-2xl font-bold text-blue-900">List a New Product</h2>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="mb-4 rounded border border-blue-900 bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add New Product
        </button>

        {showForm && (
          <form
            className="max-w-xl rounded border border-blue-200 bg-blue-50 p-5"
            onSubmit={handleCreateProduct}
          >
            <div className="mb-4">
              <label className="mb-1 block font-semibold text-blue-900">Product Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-blue-300 px-3 py-2 text-blue-900"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block font-semibold text-blue-900">
                Product Description
              </label>
              <textarea
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full rounded border border-blue-300 px-3 py-2 text-blue-900"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="mb-1 block font-semibold text-blue-900">Product Price</label>
              <input
                type="number"
                placeholder="Enter product price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded border border-blue-300 px-3 py-2 text-blue-900"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block font-semibold text-blue-900">Product Image</label>
              <input
                key={fileKey}
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="block w-full text-blue-900"
              />
            </div>

            <button
              type="submit"
              className="rounded border border-blue-900 bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              List Product
            </button>
          </form>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-2xl font-bold text-blue-900">My Listed Products</h2>
        {myProducts.length === 0 && (
          <p className="text-blue-900">You have not listed any products yet.</p>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {myProducts.map((product) => (
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
              <button
                onClick={() => handleDelete(product._id)}
                className="mt-3 w-full rounded border border-blue-900 bg-white px-3 py-2 text-blue-900 hover:bg-blue-100"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Seller;
