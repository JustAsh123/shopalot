import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router";
import { Pencil, X, Check, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";
import { AddAddress } from "../components/AddAddress";
import { AddressCard } from "../components/AddressCard"; // Import AddressCard
import { useAddresses } from "../context/useAddress"; // Import the useAddresses hook

export function Profile() {
  const { currentUser, userData, username, setUserData } = useAuth();
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [phoneValid, setPhoneValid] = useState(false);
  const [updatingPhone, setUpdatingPhone] = useState(false);
  const navigate = useNavigate();

  // Use the custom hook to manage addresses
  const { addresses, loading, error, removeAddress, setAddresses } =
    useAddresses();

  useEffect(() => {
    setPhoneValid(newPhone.length === 10);
  }, [newPhone]);

  if (!currentUser) navigate("/login");

  const handleEditPhone = async () => {
    if (!phoneValid) return toast.error("Enter a valid Phone Number.");
    setUpdatingPhone(true);
    const userDoc = doc(db, "users", userData.uid);
    try {
      await updateDoc(userDoc, {
        phoneNumber: newPhone,
      });
      // Update local userData state
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

  // Function to handle adding a new address
  const handleAddAddress = (newAddress) => {
    // Update the local addresses state
    setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
  };

  return (
    <>
      <div className="flex flex-col ml-5 mt-5">
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
                    className={
                      phoneValid ? "input input-success" : "input input-error"
                    }
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
                <Loader className="animate-spin" size={18} />
              )}
            </>
          ) : (
            <>
              <p className="font-bold">
                {userData.phoneNumber === ""
                  ? " Not Set"
                  : userData.phoneNumber}
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
          <div className="ml-8 flex flex-col gap-2">
            {loading ? (
              <p>Loading addresses...</p>
            ) : error ? (
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
                  onDelete={() => removeAddress(address.id)} // Pass delete handler
                />
              ))
            )}
            <div className="flex flex-row gap-4">
              <AddAddress onAdd={handleAddAddress} />{" "}
              {/* Pass addAddress handler */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
