import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router";
import { Pencil, X, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";
import { AddAddress } from "../components/AddAddress";
import { AddressCard } from "../components/AddressCard"; 
import { useAddresses } from "../context/useAddress"; 
import { useFetchOrders } from "../context/useFetchOrders"; // Import the new useFetchOrders hook
import OrderCard from "../components/OrderCard"; // Import OrderCard component

export function Profile() {
  const { currentUser  , userData, username, setUserData, isDark } = useAuth(); // Get isDark state
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [phoneValid, setPhoneValid] = useState(false);
  const [updatingPhone, setUpdatingPhone] = useState(false);
  const navigate = useNavigate();

  // Use the custom hook to manage addresses
  const { addresses, loading: loadingAddresses, error: addressError, removeAddress, setAddresses } = useAddresses();
  
  // Use the custom hook to fetch orders
  const { orders, loading: loadingOrders, error: ordersError } = useFetchOrders(currentUser ?.uid);
  
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setPhoneValid(newPhone.length === 10);
  }, [newPhone]);

  if (!currentUser ) navigate("/login");

  const handleEditPhone = async () => {
    if (!phoneValid) return toast.error("Enter a valid Phone Number.");
    setUpdatingPhone(true);
    const userDoc = doc(db, "users", userData.uid);
    try {
      await updateDoc(userDoc, {
        phoneNumber: newPhone,
      });
      setUserData((prevData) => ({
        ...prevData,
        phoneNumber: newPhone,
      }));
      toast.success("Phone number updated.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsEditingPhone(false);
      setUpdatingPhone(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setModalIsOpen(true);
  };

  // Function to handle adding a new address
  const handleAddAddress = (newAddress) => {
    // Update the local addresses state
    setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedOrder(null);
  };

  return (
    <>
      <div className={`flex flex-col ml-5 mt-5 ${isDark ? ' text-white' : ' text-black'}`}>
        <h1 className="text-4xl">Hello, {username}</h1>
        <hr className="my-8 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
        
        <p className="text-2xl flex flex-row gap-2">
          Phone Number:{" "}
          {isEditingPhone ? (
            <>
              {!updatingPhone ? (
                <>
                  <input
                    type="text"
                    className={`${phoneValid ? "input input-success" : "input input-error"} ${isDark?"":"bg-white"}`}
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                  <button className="btn btn-success" onClick={handleEditPhone}>
                    <Check size={18} />
                  </button>
                  <button
                    className="btn btn-error"
                    onClick={() => setIsEditingPhone(false)}
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <span className="loading loading-spinner loading-lg"></span>
              )}
            </>
          ) : (
            <>
              <p className="font-bold">
                {userData.phoneNumber === "" ? " Not Set" : userData.phoneNumber}
              </p>
              <button
                className="btn btn-ghost"
                onClick={() => setIsEditingPhone(true)}
              >
                <Pencil size={18} />
              </button>
            </>
          )}
        </p>

        <div className="text-2xl flex flex-col gap-2">
          <p>My Addresses:</p>
          <div className="lg:mx-8 md:mx-5 sm:mx-2 mt-4 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2">
            {loadingAddresses ? (
              <p>Loading addresses...</p>
            ) : addressError ? (
              <p className="text-red-700">Error loading addresses.</p>
            ) : addresses.length === 0 ? (
              <p className="text-red-700">You don't have any addresses.</p>
            ) : (
              addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  houseNo={address.houseNo}
                  street={address.street}
                  locality={address.locality}
                  pincode={address.pincode}
                  city={address.city}
                  state={address.state}
                  onDelete={() => removeAddress(address.id)} 
                  showDelete={true}
                  showRadio={false}
                />
              ))
            )}
          </div>
          <div className="flex flex-row gap-4 lg:ml-8 md:ml-5 sm:ml-2 mt-4">
            <AddAddress onAdd={handleAddAddress} />
          </div>
        </div>

        {/* Orders Section */}
        <h2 className="text-2xl mt-8 mb-4">My Orders:</h2>
        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : ordersError ? (
          <p className="text-red-700">Error loading orders.</p>
        ) : orders.length === 0 ? (
          <p className="text-red-700">You don't have any orders.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} onClick={() => handleOrderClick(order)} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
