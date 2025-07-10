// hooks/useOrders.js
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export function useOrders(userId) {
  const createOrder = async (orderData) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        userId,
        createdAt: new Date() // Store the creation timestamp
      });
      return docRef.id; // Return the order ID
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const getUserOrders = async () => {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  return { createOrder, getUserOrders };
}
