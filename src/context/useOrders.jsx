import { collection, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase/firebase"; // Ensure this path is correct
import toast from "react-hot-toast";

export const useOrders = () => {
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);

  /**
   * Places a new order in the Firestore 'orders' collection.
   *
   * @param {string} userId - The ID of the authenticated user.
   * @param {Array<object>} cartItems - The items currently in the user's cart (id, qty).
   * @param {number} totalPrice - The calculated total price of the order.
   * @param {string} deliveryAddressId - The ID of the selected delivery address.
   * @param {string} paymentMethod - The selected payment method.
   * @param {Array<object>} allProducts - All available products to get details (name, price, imageUrl).
   * @param {Array<object>} allAddresses - All available addresses to get full address details.
   */
  const placeOrder = async (userId, cartItems, totalPrice, deliveryAddressId, paymentMethod, allProducts, allAddresses) => {
    setPlacingOrder(true);
    setOrderError(null);

    if (!userId) {
      setOrderError(new Error("User not authenticated. Cannot place order."));
      toast.error("Please log in to place an order.");
      setPlacingOrder(false);
      return;
    }
    if (cartItems.length === 0) {
      setOrderError(new Error("Cart is empty. Cannot place order."));
      toast.error("Your cart is empty. Add items before placing an order.");
      setPlacingOrder(false);
      return;
    }
    if (!deliveryAddressId) {
      setOrderError(new Error("No delivery address selected."));
      toast.error("Please select a delivery address.");
      setPlacingOrder(false);
      return;
    }
    if (!paymentMethod) {
      setOrderError(new Error("No payment method selected."));
      toast.error("Please select a payment method.");
      setPlacingOrder(false);
      return;
    }

    try {
      // 1. Prepare order items with current product details (snapshot prices/names)
      const orderItems = cartItems.map(item => {
        const product = allProducts.find(p => p.id === item.id);
        if (!product) {
          console.warn(`Product with ID ${item.id} not found when placing order. It will be excluded or marked as missing.`);
          return {
            id: item.id,
            qty: item.qty,
            nameAtOrder: "Product Not Found",
            priceAtOrder: 0,
            imageUrlAtOrder: "https://placehold.co/64x64/cccccc/000000?text=N/A"
          };
        }
        return {
          id: item.id,
          qty: item.qty,
          nameAtOrder: product.name,
          priceAtOrder: product.price,
          imageUrlAtOrder: product.imageUrl // Store image URL for order history display
        };
      });

      // 2. Get full delivery address details
      const selectedAddress = allAddresses.find(addr => addr.id === deliveryAddressId);
      if (!selectedAddress) {
        setOrderError(new Error("Selected delivery address not found."));
        toast.error("Selected delivery address is invalid.");
        setPlacingOrder(false);
        return;
      }

      // 3. Construct the order object
      const orderData = {
        userId: userId,
        items: orderItems,
        totalAmount: totalPrice,
        deliveryAddress: { // Store a copy of the address at the time of order
          houseNo: selectedAddress.houseNo,
          street: selectedAddress.street,
          locality: selectedAddress.locality,
          pincode: selectedAddress.pincode,
          city: selectedAddress.city,
          state: selectedAddress.state,
          // You might include other address fields like name, phone if available
        },
        paymentMethod: paymentMethod,
        orderDate: serverTimestamp(), // Firestore timestamp for when the order was created
        status: "Pending", // Initial status of the order
      };

      // 4. Add the order to the 'orders' collection
      const docRef = await addDoc(collection(db, "orders"), orderData);
      toast.success(`Order placed successfully! Order ID: ${docRef.id}`);
      console.log("Order placed with ID:", docRef.id);
      return docRef.id; // Return the new order ID
    } catch (err) {
      console.error("Error placing order:", err);
      setOrderError(err);
      toast.error("Failed to place order. Please try again.");
      return null;
    } finally {
      setPlacingOrder(false);
    }
  };

  return { placeOrder, placingOrder, orderError };
};
