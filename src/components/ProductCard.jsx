import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

function ProductCard(props) {
  const { userData } = useAuth();
  const { addToCart, removeFromCart, cartItems, updating } = useCart(userData.uid);
  const [qty, setQty] = useState(0);

  useEffect(() => {
    console.log("Debug - Current cart items:", cartItems);
    console.log("Debug - Looking for product:", { 
      prodId: props.prodId, 
      id: props.id 
    });

    const item = cartItems.find(item => 
      item.prodId === props.prodId || 
      item.id === props.prodId || 
      item.id === props.id
    );
    
    console.log("Debug - Found item:", item);
    setQty(item ? item.qty : 0);
  }, [cartItems, props.id, props.prodId]);

  const handleAddToCart = () => {
    if (!updating) {
      addToCart(userData.uid, props.prodId);
    }
  };

  const handleRemoveFromCart = () => {
    if (!updating) {
      removeFromCart(userData.uid, props.prodId);
    }
  };

  return (
    <>
      <div className="card bg-base-200 w-96 shadow-sm shadow-blue-800">
        <figure className="bg-white" onClick={() => document.getElementById(`product_modal_${props.prodId}`).showModal()}>
          <img src={props.imageUrl} alt={props.name} className="h-70" />
        </figure>
        <div className="card-body">
          <h2 
            onClick={() => document.getElementById(`product_modal_${props.prodId}`).showModal()} 
            className="card-title"
          >
            {props.name}
          </h2>
          <div className="card-actions justify-between">
            <p className="flex flex-row mt-3 text-xl text-yellow-500">
              ₹{props.price}
            </p>
            
            {/* Restored your original updating logic */}
            {qty === 0 ? (
              updating ? (
                <Loader className="animate-spin" />
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="bg-blue-600 px-4 py-2 rounded text-white cursor-pointer"
                >
                  Add to cart
                </button>
              )
            ) : (
              updating ? (
                <Loader className="animate-spin" />
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
              )
            )}
          </div>
        </div>
      </div>

      <dialog id={`product_modal_${props.prodId}`} className="modal">
        <div className="modal-box">
          <figure className="bg-white flex justify-center">
            <img src={props.imageUrl} alt={props.name} className="h-80" />
          </figure>
          <h3 className="font-bold text-xl mt-3">{props.name}</h3>
          <p className="py-4">{props.desc}</p>
          <div className="flex justify-between items-center">
            <p className="text-yellow-400 text-xl">₹{props.price}</p>
            {qty === 0 ? (
              updating ? (
                <Loader className="animate-spin" />
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="bg-blue-600 px-4 py-2 rounded text-white cursor-pointer"
                >
                  Add to cart
                </button>
              )
            ) : (
              updating ? (
                <Loader className="animate-spin" />
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
              )
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export default ProductCard;
