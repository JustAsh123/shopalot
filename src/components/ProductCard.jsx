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
  
  const { isDark } = useAuth(); // Get isDark state

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
        className={`px-4 py-2 rounded text-white cursor-pointer ${isDark ? 'bg-blue-600' : 'bg-lime-600 border-black border-2'}`}
      >
        Add to cart
      </button>
    ) : (
      <div className="flex items-center gap-2">
        <button
          onClick={handleRemoveFromCart}
          className={`px-2 py-1 rounded text-white cursor-pointer ${isDark ? 'bg-red-600' : 'bg-red-500'}`}
        >
          -
        </button>
        <span className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>{qty}</span>
        <button
          onClick={handleAddToCart}
          className={`px-2 py-1 rounded text-white cursor-pointer ${isDark ? 'bg-green-600' : 'bg-green-500'}`}
        >
          +
        </button>
      </div>
    );
  };

  return (
    <>
      <div className={`card w-96 shadow-sm ${isDark ? 'bg-gray-800 text-white shadow-blue-800' : 'bg-white text-black shadow-black'} `}>
        <figure className={`h-70 ${isDark ? 'bg-white' : 'bg-white'}`} onClick={() => setIsModalOpen(true)}>
          <img src={imageUrl} alt={name} className="h-70 bg-white" />
        </figure>
        <div className={`card-body ${isDark?"":""}`}>
          <h2 onClick={() => setIsModalOpen(true)} className="card-title">
            {name}
            <div className={`outline outline-success text-sm rounded-lg ${isDark ? 'text-gray-300' : 'text-gray-500'} p-0.5`}>
              {categoryName}
            </div>
          </h2>
          <div className="card-actions justify-between items-center">
            <p className={`flex flex-row mt-3 text-xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`}>
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
