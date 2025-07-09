// In ProductCard.jsx
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCategory } from "../context/useCategory";

function ProductCard({ prodId, id, imageUrl, name, price, desc, category }) {
  const { userData } = useAuth();
  const [qty, setQty] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { allCategoriesFlat, loading: categoriesLoading } = useCategory();
  const [categoryName, setCategoryName] = useState("Loading Category...");

  const { addToCart, removeFromCart, cartItems, updating } = userData
    ? useCart(userData.uid)
    : {};

  useEffect(() => {
    if (userData) {
      const item = cartItems.find(
        (item) => item.prodId === prodId || item.id === prodId || item.id === id
      );
      setQty(item ? item.qty : 0);
    }
  }, [cartItems, userData, id, prodId]);

  useEffect(() => {
    if (!categoriesLoading && allCategoriesFlat.length > 0) {
      const foundCategory = allCategoriesFlat.find(
        (cat) => cat.id === category
      );
      setCategoryName(foundCategory ? foundCategory.name : "Unknown Category");
    } else if (categoriesLoading) {
      setCategoryName("Loading Category...");
    }
  }, [allCategoriesFlat, category, categoriesLoading]);

  const handleAddToCart = () => {
    if (!updating && userData) {
      addToCart(userData.uid, prodId);
    } else {
      toast.error("Please login to do that.");
    }
  };

  const handleRemoveFromCart = () => {
    if (!updating) {
      removeFromCart(userData.uid, prodId);
    }
  };

  const renderCartButtons = () => {
    if (updating) {
      return <Loader className="animate-spin" />;
    }
    return qty === 0 ? (
      <button
        onClick={handleAddToCart}
        className="bg-blue-600 px-4 py-2 rounded text-white cursor-pointer"
      >
        Add to cart
      </button>
    ) : (
      <div className="flex items-center gap-2">
        <button
          onClick={handleRemoveFromCart}
          className="bg-red-600 px-2 py-1 rounded text-white cursor-pointer"
        >
          -
        </button>
        <span className="text-white font-medium">{qty}</span>
        <button
          onClick={handleAddToCart}
          className="bg-green-600 px-2 py-1 rounded text-white cursor-pointer"
        >
          +
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="card bg-base-200 w-96 shadow-sm shadow-blue-800">
        <figure className="bg-white" onClick={() => setIsModalOpen(true)}>
          <img src={imageUrl} alt={name} className="h-70" />
        </figure>
        <div className="card-body">
          <h2 onClick={() => setIsModalOpen(true)} className="card-title">
            {name}
            {/* Added Tailwind CSS classes for truncation */}
            <div className="outline outline-success text-sm rounded-lg text-gray-500 p-0.5">
              {categoryName}
            </div>
          </h2>
          <div className="card-actions justify-between items-center">
            <p className="flex flex-row mt-3 text-xl text-yellow-500">
              ₹{price}
            </p>
            {renderCartButtons()}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductCard;
