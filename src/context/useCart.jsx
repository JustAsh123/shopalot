import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";

export const useCart = (userId) => {
  const [cartItems, setCartItems] = useState([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      const cartRef = doc(db, "carts", userId);
      const snap = await getDoc(cartRef);
      if (snap.exists()) {
        setCartItems(snap.data().cartItems || []);
      }
    };
    fetchCart();
  }, [userId]);

  const addToCart = async (userId, productId) => {
    setUpdating(true)
    console.log("Adding to cart:", productId); // ✅ check ID being passed

    const cartRef = doc(db, "carts", userId);
    const snap = await getDoc(cartRef);
    let newCartItems = [];

    if (snap.exists()) {
      const data = snap.data();
      const existing = data.cartItems || [];
      console.log("Existing cart:", existing);

      const index = existing.findIndex((item) => item.id === productId);
      if (index >= 0) {
        existing[index].qty += 1;
      } else {
        existing.push({ id: productId, qty: 1 });
      }
      newCartItems = existing;
    } else {
      newCartItems = [{ id: productId, qty: 1 }];
    }

    console.log("New cartItems array:", newCartItems);

    await setDoc(cartRef, { cartItems: newCartItems });
    setCartItems(newCartItems)
    toast.success("Item added Successfully.");
    console.log("Cart updated ✅");
    setUpdating(false);
  };

 const removeFromCart = async (userId, productId) => {
  setUpdating(true)
if (!userId || !productId) {
console.error("Missing userId or productId");
return;
}

const cartRef = doc(db, "carts", userId);
const snap = await getDoc(cartRef);
if (!snap.exists()) return;

const data = snap.data();
const current = data.cartItems || [];

// Find the item index
const index = current.findIndex(item => item.id === productId);
if (index === -1) return;

// Reduce qty or remove
if (current[index].qty > 1) {
current[index].qty -= 1;
} else {
current.splice(index, 1); // remove completely if qty is 1
}

// Save updated cart
await setDoc(cartRef, { cartItems: current });
setCartItems(current); // <- Make sure you update state manually!
setUpdating(false)
};
  return { cartItems, addToCart, removeFromCart, updating };
};
