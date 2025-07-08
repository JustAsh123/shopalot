import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { doc, setDoc , getDoc, updateDoc} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/useAuth";
import { Loader } from "lucide-react";

export function AddAddress() {
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [locality, setLocality] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {currentUser, username, userData} = useAuth();

  const validateForm = () => {
    if (
      houseNo.trim() !== "" &&
      street.trim() !== "" &&
      pincode.trim() !== ""
    )
      return true;
    return false;
  };

  useEffect(()=>{
    if(pincode.length===6) fetchArea(pincode)
  },[pincode])

  const fetchArea = async (pincode) => {
    // 1. Validate pincode format (6 digits for Indian PIN codes)
    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!pinRegex.test(pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    try {
      // 2. Show loading state
      setIsLoading(true);

      // 3. API call (using Postalpincode.in as example)
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      // 4. Check API response
      if (data[0].Status === "Error") {
        toast.error("Invalid pincode or no data available");
        return;
      }

      // 5. Extract city and state
      const postOffice = data[0]?.PostOffice?.[0];
      if (postOffice) {
        setCity(postOffice.District || postOffice.Name);
        setState(postOffice.State);
        toast.success("Location data found!");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch location data");
    } finally {
      setIsLoading(false);
    }
  };

  const saveAddress = async () => {
  if (!validateForm()) {
    toast.error("Please fill in all required fields");
    return;
  }

  try {
    setIsLoading(true);
    
    const newAddress = {
      houseNo,
      street,
      locality,
      pincode,
      city,
      state,
      createdAt: new Date().toISOString() // Optional: add timestamp
    };

    // 1. Get current user doc
    const userDocRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userDocRef);

    // 2. Prepare updated addresses array
    const currentAddresses = userSnap.exists() 
      ? userSnap.data().addresses || []
      : [];

    // 3. Update Firestore (using arrayUnion to append new address)
    await updateDoc(userDocRef, {
      addresses: [...currentAddresses, newAddress]
    });

    toast.success("Address saved successfully!");
    
    // Reset form
    setHouseNo("");
    setStreet("");
    setLocality("");
    setPincode("");
    setCity("");
    setState("");
    
    // Close modal
    document.getElementById("add_address").close();
    
  } catch (error) {
    console.error("Error saving address:", error);
    toast.error("Failed to save address");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <>
      <button
        className="btn btn-outline btn-success text-l text-white"
        onClick={() => document.getElementById("add_address").showModal()}
      >
        Add an Address
      </button>
      <dialog id="add_address" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add an Address</h3>
          <div className="flex flex-col gap-2 my-4 w-full">
            <input
              type="text"
              placeholder="House/Flat/Building Number"
              className="input w-full"
              onChange={(e) => setHouseNo(e.target.value)}
            />
            <input
              type="text"
              placeholder="Street Address"
              className="input w-full"
              onChange={(e) => setStreet(e.target.value)}
            />
            <input
              type="text"
              placeholder="Locality/Area Name"
              className="input w-full"
              onChange={(e) => setLocality(e.target.value)}
            />
            <div className="flex flex-row gap-2">
              <input
                type="text"
                placeholder="Postal Code"
                className="input w-full"
                onChange={(e) => setPincode(e.target.value)}
              />
              <input
                type="text"
                placeholder="City"
                className="input w-full"
                disabled={true}
                value={city}
              />
            </div>
            <input
              type="text"
              placeholder="State"
              className="input w-full"
              disabled={true}
              value={state}
            />
          </div>
          <div className="modal-action">
            <button className="btn btn-success" onClick={saveAddress} disabled={isLoading}>{!isLoading?"Add":(<Loader className="animate-spin" size={18}/>)}</button>
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
