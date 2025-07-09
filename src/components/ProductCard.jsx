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
  const { categories, loading } = useCategory(); // Get categories from the hook
  const [categoryName, setCategoryName] = useState("");

  const { addToCart, removeFromCart, cartItems, updating } = userData ? useCart(userData.uid) : {};

  useEffect(() => {
    if (userData) {
      const item = cartItems.find(item => 
        item.prodId === prodId || 
        item.id === prodId || 
        item.id === id
      );
      setQty(item ? item.qty : 0);
    }
  }, [cartItems, userData, id, prodId]);

  // Find the category name based on the category ID passed as a prop
  useEffect(() => {
    if (categories.length > 0) {
      const foundCategory = categories.find(cat => cat.id === category);
      setCategoryName(foundCategory ? foundCategory.name : "Unknown Category");
    }
  }, [categories, category]);

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
          <h2 
            onClick={() => setIsModalOpen(true)} 
            className="card-title"
          >
            {name}
            <div className="badge badge-outline badge-secondary">{categoryName}</div>
          </h2>
          <div className="card-actions justify-between">
            <p className="flex flex-row mt-3 text-xl text-yellow-500">
              ₹{price}
            </p>
            {renderCartButtons()}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <dialog className="modal" open>
          <div className="modal-box">
            <figure className="bg-white flex justify-center">
              <img src={imageUrl} alt={name} className="h-80 object-contain" />
            </figure>
            <h3 className="font-bold text-xl mt-3">{name}</h3>
            <p className="py-4">{desc}</p>
            <div className="flex justify-between items-center">
              <p className="text-yellow-400 text-xl">₹{price}</p>
              {renderCartButtons()}
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsModalOpen(false)}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
}

export default ProductCard;
