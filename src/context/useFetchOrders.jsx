import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore"; // Removed orderBy import
import { db } from "../firebase/firebase"; // Ensure this path is correct
import toast from "react-hot-toast"; // For user feedback

/**
 * Custom React hook for fetching a user's orders from Firestore.
 * Fetches orders and sorts them in memory by orderDate.
 *
 * @param {string | null | undefined} userId - The ID of the current authenticated user.
 * @returns {object} An object containing:
 * - orders: An array of order objects.
 * - loading: Boolean indicating if orders are currently being loaded.
 * - error: Error object if fetching orders fails.
 */
export const useFetchOrders = (userId) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      // Start loading and clear any previous errors
      setLoading(true);
      setError(null);

      // If no userId is provided (e.g., user not logged in or still authenticating),
      // clear orders and stop loading.
      if (!userId) {
        console.log("No user ID provided. Not fetching orders.");
        setOrders([]); // Ensure orders array is empty
        setLoading(false);
        return; // Exit early
      }

      console.log("Fetching orders for user ID:", userId);
      try {
        const ordersCollectionRef = collection(db, "orders");
        // Create a query to get orders for the specific user ID.
        // Removed `orderBy` from Firestore query to avoid index issues.
        const ordersQuery = query(
          ordersCollectionRef,
          where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(ordersQuery);
        let ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort orders in memory by orderDate (descending)
        // Ensure orderDate exists and is a Firestore Timestamp or comparable value
        ordersData.sort((a, b) => {
          const dateA = a.orderDate ? a.orderDate.toDate() : new Date(0); // Convert Timestamp to Date, handle missing
          const dateB = b.orderDate ? b.orderDate.toDate() : new Date(0); // Convert Timestamp to Date, handle missing
          return dateB.getTime() - dateA.getTime(); // Descending order
        });

        // Assume ordersData is an array of objects, where each object
        // has an 'orderDate' property (which is a Firebase Timestamp)
        // and a 'status' property you want to update.

        ordersData.forEach((order) => {
          // Renamed 'orders' to 'order' for clarity within the loop
          const orderDateJs = order.orderDate.toDate(); // Convert Firebase Timestamp to JS Date
          const today = new Date(); // Get the current date and time

          // Calculate the difference in milliseconds
          const differenceInMilliseconds =
            today.getTime() - orderDateJs.getTime(); // today - orderDate

          // Convert milliseconds to hours and days for comparison
          const millisecondsPerHour = 1000 * 60 * 60;
          const millisecondsPerDay = millisecondsPerHour * 24;

          const differenceInHours =
            differenceInMilliseconds / millisecondsPerHour;
          const differenceInDays =
            differenceInMilliseconds / millisecondsPerDay;

          if (differenceInDays >= 1) {
            order.status = "Delivered";
          } else if (differenceInHours >= 6) {
            order.status = "Shipped";
          } else {
            order.status = "Processing";
          }
        });

        // After the loop, ordersData array will have its 'status' properties updated.
        // If you need to save these changes back to Firestore, you'd then
        // iterate over ordersData again and update each document.
        setOrders(ordersData);
        console.log("Fetched and sorted orders:", ordersData);
        toast.success("Orders loaded successfully!");
      } catch (err) {
        console.error("Error fetching orders:", err); // Log the actual error
        setError(err);
        setOrders([]); // Clear orders on error
        toast.error("Failed to load your orders. Please try again.");
      } finally {
        setLoading(false); // Always stop loading, regardless of success or error
      }
    };

    fetchOrders();
  }, [userId]); // Re-run effect only when userId changes

  return { orders, loading, error };
};
