import Cart from "./Cart";
import { MapIcon } from "lucide-react";
import { useAddresses } from "../context/useAddress";
import { AddressCard } from "../components/AddressCard";
import { useState } from "react";
import { CreditCard } from "lucide-react";

export function Checkout() {
  const { addresses, loading, error } = useAddresses();

  const [deliverTo, setDeliverTo] = useState("");

  const handleDeliveryAddress = (addId) => {
    setDeliverTo(addId);
    console.log(addId)
  }

  return (
    <div className="grid md:grid-cols-2 sm:grid-cols-1" >
      <Cart isOnCheckout={true} />
      <div className="m-8 flex flex-col gap-8">
        <p className="text-2xl text-primary flex flex-row gap-1 items-center">
          <MapIcon size={24} /> Deliver To :{" "}
        </p>
        <div className="lg:mx-8 md:mx-5 sm:mx-2 mt-4 grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-2">
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
                showRadio = {true}
                onRadio = {()=>handleDeliveryAddress(address.id)}
                houseNo={address.houseNo}
                street={address.street}
                locality={address.locality}
                pincode={address.pincode}
                city={address.city}
                state={address.state}
                showDelete = {false}
              />
            ))
          )}
        </div>
        <p className="text-2xl text-primary flex flex-row gap-1 items-center">
          <CreditCard size={24}/> Payment Options:
        </p>
      </div>
    </div>
  );
}
