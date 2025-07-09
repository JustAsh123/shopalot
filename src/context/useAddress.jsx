import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase'; // Adjust path as needed
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../context/useAuth';

export function useAddresses() {
  const { currentUser  } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch addresses on mount or user change
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!currentUser ?.uid) {
        setAddresses([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const userRef = doc(db, 'users', currentUser .uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setAddresses(userData.addresses || []);
        } else {
          setAddresses([]); // No addresses found
        }
      } catch (err) {
        setError(err);
        console.error("Error fetching addresses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [currentUser ?.uid]);

  // Add new address
  const addAddress = async (newAddress) => {
    if (!currentUser ?.uid) throw new Error("Not authenticated");

    setLoading(true);
    try {
      const userRef = doc(db, 'users', currentUser .uid);
      const addressWithId = {
        id: Date.now().toString(), // Generate a unique ID
        ...newAddress
      };

      await updateDoc(userRef, {
        addresses: arrayUnion(addressWithId)
      });

      // Update local state
      setAddresses(prev => [...prev, addressWithId]);
    } catch (err) {
      setError(err);
      console.error("Error adding address:", err);
    } finally {
      setLoading(false);
    }
  };

  // Remove address
  const removeAddress = async (addressId) => {
    if (!currentUser ?.uid) throw new Error("Not authenticated");

    setLoading(true);
    try {
      const userRef = doc(db, 'users', currentUser .uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const addressToRemove = userData.addresses?.find(a => a.id === addressId);
        
        if (addressToRemove) {
          await updateDoc(userRef, {
            addresses: arrayRemove(addressToRemove)
          });

          // Update local state
          setAddresses(prev => prev.filter(a => a.id !== addressId));
        }
      }
    } catch (err) {
      setError(err);
      console.error("Error removing address:", err);
    } finally {
      setLoading(false);
    }
  };

  // Set default address
  const setDefaultAddress = async (addressId) => {
    if (!currentUser ?.uid) throw new Error("Not authenticated");

    setLoading(true);
    try {
      const userRef = doc(db, 'users', currentUser .uid);
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));

      await updateDoc(userRef, {
        addresses: updatedAddresses
      });

      // Update local state
      setAddresses(updatedAddresses);
    } catch (err) {
      setError(err);
      console.error("Error setting default address:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    addresses,
    loading,
    setAddresses,
    error,
    addAddress,
    removeAddress,
    setDefaultAddress,
    retry: () => setError(null) // Simple error recovery
  };
}
