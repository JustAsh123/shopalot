import React from "react";
import { useCart } from "../context/useCart"; // Adjust the path as necessary
import { useProducts } from "../context/useProducts"; // Adjust the path as necessary
import { useAuth } from "../context/useAuth"; // Adjust the path as necessary
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

const Cart = ({ isOnCheckout }) => {
  const { currentUser , isDark } = useAuth(); // Get isDark state
  const { cartItems, addToCart, removeFromCart, updating } = useCart(
    currentUser ?.uid
  );
  const { prods, loading, error } = useProducts();
  const navigate = useNavigate();

  // Create a mapping of product IDs to product details
  const productMap = {};
  prods.forEach((product) => {
    productMap[product.id] = product;
  });

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    const product = productMap[item.id];
    return total + (product?.price || 0) * item.qty;
  }, 0);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-error">Error: {error.message}</div>
    );

  return (
    <div
      className={`container mx-auto p-4 md:p-8 ${
        isDark ? " text-white" : "text-lime-600"
      }`}
    >
      {!isOnCheckout && (
        <h1 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-lime-600"}`}>
          Your Shopping Cart
        </h1>
      )}

      {updating && (
        <div className={`alert alert-info mb-6 ${isDark ? "bg-gray-800 text-white" : "bg-blue-100 text-black"}`}>
          <span>Updating your cart...</span>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-2xl mb-4">Your cart is empty</div>
          <button
            className={`btn btn-primary ${isDark ? "bg-blue-600" : "bg-blue-500"}`}
            onClick={() => {
              navigate("/");
            }}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className={`table w-full ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <thead>
              <tr>
                <th className={`${isDark?"text-white":"text-black"}`}>Product</th>
                <th className={`${isDark?"text-white":"text-black"}`}>Quantity</th>
                <th className={`${isDark?"text-white":"text-black"}`}>Price</th>
                {!isOnCheckout && <th className={`${isDark?"text-white":"text-black"}`}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => {
                const product = productMap[item.id];
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-center">
                        <img
                          src={product?.imageUrl}
                          alt={product?.name}
                          className="w-16 h-16 mr-4 object-contain bg-white"
                        />
                        <span>{product?.name}</span>
                      </div>
                    </td>
                    <td>{item.qty}</td>
                    <td>₹{(product?.price * item.qty).toFixed(2)}</td>
                    {!isOnCheckout && (
                      <td className="flex flex-row gap-2">
                        <button
                          className={`btn text-2xl font-bold text-white btn-error ${isDark ? "bg-red-600" : "bg-red-500"}`}
                          onClick={() => removeFromCart(currentUser ?.uid, item.id)}
                        >
                          -
                        </button>

                        <button
                          className={`btn text-2xl text-white btn-success mr-2 ${isDark ? "bg-green-600" : "bg-green-500"}`}
                          onClick={() => addToCart(currentUser ?.uid, item.id)}
                        >
                          +
                        </button>
                        
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!isOnCheckout && (
            <div className="mt-4 text-right flex flex-row justify-end items-center gap-4">
              <h2 className="text-xl font-bold">
                Total: ₹{totalPrice.toFixed(2)}
              </h2>
              <a className={`btn border-2 btn-outline ${isDark ? "hover:bg-secondary text-white btn-secondary" : "border-lime-600 hover:bg-lime-600 text-black"}`} href="/checkout">
                Checkout
                <ArrowRight size={24} />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
