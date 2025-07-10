import React from 'react';
import { useCart } from '../context/useCart'; // Adjust the path as necessary
import { useProducts } from '../context/useProducts'; // Adjust the path as necessary
import { useAuth } from '../context/useAuth'; // Adjust the path as necessary
import { ArrowRight } from 'lucide-react';

const Cart = ({isOnCheckout}) => {
  const { currentUser  } = useAuth();
  const { cartItems, addToCart, removeFromCart, updating } = useCart(currentUser ?.uid);
  const { prods, loading, error } = useProducts();

  // Create a mapping of product IDs to product details
  const productMap = {};
  prods.forEach(product => {
    productMap[product.id] = product;
  });

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    const product = productMap[item.id];
    return total + (product?.price || 0) * item.qty;
  }, 0);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-error">Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      {!isOnCheckout && <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>}

      {updating && (
        <div className="alert alert-info mb-6">
          <span>Updating your cart...</span>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-2xl mb-4">Your cart is empty</div>
          <button className="btn btn-primary">Continue Shopping</button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                {!isOnCheckout && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => {
                const product = productMap[item.id];
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-center">
                        <img src={product?.imageUrl} alt={product?.name} className="w-16 h-16 mr-4 object-contain bg-white" />
                        <span>{product?.name}</span>
                      </div>
                    </td>
                    <td>{item.qty}</td>
                    <td>₹{(product?.price * item.qty).toFixed(2)}</td>
                    {!isOnCheckout && <td>
                      <button
                        className="btn btn-success mr-2"
                        onClick={() => addToCart(currentUser ?.uid, item.id)}
                      >
                        +
                      </button>
                      <button
                        className="btn btn-error"
                        onClick={() => removeFromCart(currentUser ?.uid, item.id)}
                      >
                        -
                      </button>
                    </td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!isOnCheckout && <div className="mt-4 text-right flex flex-row justify-end items-center gap-4">
            <h2 className="text-xl font-bold">Total: ₹{totalPrice.toFixed(2)}</h2>
            <a className='btn btn-outline btn-secondary' href='/checkout'>Checkout<ArrowRight size={24}/></a>
          </div>}
        </div>
      )}
    </div>
  );
};

export default Cart;
