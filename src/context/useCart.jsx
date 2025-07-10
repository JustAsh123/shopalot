import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase"; // Ensure this path is correct for your Firebase instance
import toast from "react-hot-toast"; // For user feedback

/**
 * Custom React hook for managing user's shopping cart with Firestore.
 * Provides real-time updates and functions to add/remove items.
 *
 * @param {string | null | undefined} userId - The ID of the current authenticated user.
 * This should be passed from useAuth (e.g., currentUser?.uid).
 */
export const useCart = (userId) => {
  const [cartItems, setCartItems] = useState([]);
  const [updating, setUpdating] = useState(false); // Indicates if an add/remove operation is in progress
  const [loading, setLoading] = useState(true); // Indicates if the initial cart data is being loaded
  const [error, setError] = useState(null); // Stores any errors that occur during cart operations

  // useEffect to set up real-time listener for the user's cart
  useEffect(() => {
    // Start loading state when userId changes or component mounts
    setLoading(true);
    setError(null); // Clear any previous errors

    // If no userId is provided (e.g., user is not logged in or still authenticating),
    // clear the cart and stop loading.
    if (!userId) {
      setCartItems([]);
      setLoading(false);
      return; // Exit early as there's no cart to fetch
    }

    // Reference to the specific user's cart document in Firestore
    const cartRef = doc(db, "carts", userId);

    // Set up a real-time subscription to the cart document.
    // onSnapshot will immediately call the callback with the current data,
    // and then again whenever the data in Firestore changes.
    const unsubscribe = onSnapshot(
      cartRef,
      (docSnap) => {
        if (docSnap.exists()) {
          // If the document exists, set cartItems from its data.
          // Ensure 'cartItems' field exists and is an array, default to empty array.
          setCartItems(docSnap.data().cartItems || []);
        } else {
          // If the document does not exist, the cart is effectively empty.
          setCartItems([]);
        }
        setLoading(false); // Data has been fetched, stop loading
        setError(null); // Clear any errors on successful snapshot
      },
      (err) => {
        // Handle errors during the real-time subscription
        console.error("Error fetching cart in real-time:", err);
        setError(err); // Store the error
        setLoading(false); // Stop loading even on error
        setCartItems([]); // Ensure cart is empty if there's an error loading
        toast.error("Failed to load cart data. Please refresh.");
      }
    );

    // Cleanup function: This will be called when the component unmounts
    // or when the 'userId' dependency changes, ensuring no memory leaks
    // from lingering subscriptions.
    return () => unsubscribe();
  }, [userId]); // Dependency array: Re-run this effect only when userId changes.

  /**
   * Adds a product to the user's cart.
   * Increments quantity if item exists, otherwise adds new item.
   *
   * @param {string} currentUserId - The ID of the user performing the action.
   * @param {string} productId - The ID of the product to add.
   */
  const addToCart = async (currentUserId, productId) => {
    if (!currentUserId || !productId) {
      toast.error("User ID or Product ID is missing. Cannot add to cart.");
      return;
    }

    setUpdating(true); // Indicate that an update operation is in progress
    setError(null); // Clear any previous errors

    try {
      const cartRef = doc(db, "carts", currentUserId);
      // Fetch the current state of the cart from Firestore to ensure we're working
      // with the latest data before making modifications.
      const snap = await getDoc(cartRef);
      let updatedCartItems = []; // This will hold the new state of the cart

      if (snap.exists()) {
        // If cart document exists, retrieve existing items
        const data = snap.data();
        const existingItems = data.cartItems || [];

        // Check if the product already exists in the cart
        const itemIndex = existingItems.findIndex((item) => item.id === productId);

        if (itemIndex >= 0) {
          // If product exists, create a new array to maintain immutability
          updatedCartItems = existingItems.map((item, index) =>
            index === itemIndex ? { ...item, qty: item.qty + 1 } : item
          );
        } else {
          // If product does not exist, add it as a new item
          updatedCartItems = [...existingItems, { id: productId, qty: 1 }];
        }
      } else {
        // If cart document doesn't exist, create a new cart with the item
        updatedCartItems = [{ id: productId, qty: 1 }];
      }

      // Save the updated cart back to Firestore
      await setDoc(cartRef, { cartItems: updatedCartItems });

      // Optimistically update local state for immediate UI feedback.
      // The onSnapshot listener will eventually sync this, but this makes it snappier.
      setCartItems(updatedCartItems);
      toast.success("Item added to cart successfully!");
    } catch (err) {
      console.error("Error adding item to cart:", err);
      setError(err); // Store the error
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setUpdating(false); // Operation complete
    }
  };

  /**
   * Removes a product from the user's cart or decrements its quantity.
   *
   * @param {string} currentUserId - The ID of the user performing the action.
   * @param {string} productId - The ID of the product to remove/decrement.
   */
  const removeFromCart = async (currentUserId, productId) => {
    if (!currentUserId || !productId) {
      toast.error("User ID or Product ID is missing. Cannot remove from cart.");
      return;
    }

    setUpdating(true); // Indicate that an update operation is in progress
    setError(null); // Clear any previous errors

    try {
      const cartRef = doc(db, "carts", currentUserId);
      const snap = await getDoc(cartRef); // Fetch current cart state

      if (!snap.exists()) {
        toast.error("Cart not found for removal operation.");
        return; // Nothing to remove if cart doesn't exist
      }

      const data = snap.data();
      let currentItems = data.cartItems || [];

      // Find the item's index in the current cart
      const itemIndex = currentItems.findIndex((item) => item.id === productId);

      if (itemIndex === -1) {
        toast.error("Item not found in cart to remove.");
        return; // Item not in cart
      }

      let updatedCartItems;
      if (currentItems[itemIndex].qty > 1) {
        // If quantity > 1, decrement quantity
        updatedCartItems = currentItems.map((item, index) =>
          index === itemIndex ? { ...item, qty: item.qty - 1 } : item
        );
      } else {
        // If quantity is 1, remove the item completely from the cart
        updatedCartItems = currentItems.filter((item, index) => index !== itemIndex);
      }

      // Save the updated cart back to Firestore
      await setDoc(cartRef, { cartItems: updatedCartItems });

      // Optimistically update local state
      setCartItems(updatedCartItems);
      toast.success("Item removed from cart successfully!");
    } catch (err) {
      console.error("Error removing item from cart:", err);
      setError(err); // Store the error
      toast.error("Failed to remove item from cart. Please try again.");
    } finally {
      setUpdating(false); // Operation complete
    }
  };

  // Return cart data, functions, and status flags
  return { cartItems, addToCart, removeFromCart, updating, loading, error };
};
