import Cart from "./Cart";
import { MapIcon } from "lucide-react";
import { useAddresses } from "../context/useAddress";
import { AddressCard } from "../components/AddressCard";
import { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";
import { useCart } from "../context/useCart"; // Import useCart
import { useProducts } from "../context/useProducts"; // Import useProducts
import { useAuth } from "../context/useAuth"; // Import useAuth for currentUser and authLoading
import { Wallet, Landmark, HandCoins, Bitcoin } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export function Checkout() {
  // Get states from useAuth, useAddresses, useProducts, and useCart
  const { currentUser, loading: authLoading, userData } = useAuth();
  const navigate = useNavigate();
  const {
    addresses,
    loading: addressesLoading,
    error: addressesError,
  } = useAddresses();
  // Pass currentUser?.uid to useCart to ensure it fetches for the correct user
  const {
    cartItems,
    loading: cartLoading,
    error: cartError,
  } = useCart(currentUser?.uid);
  const {
    prods,
    loading: productsLoading,
    error: productsError,
  } = useProducts();

  const [deliverTo, setDeliverTo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // Create a map for quick product lookup
  const productMap = {};
  prods.forEach((product) => {
    productMap[product.id] = product;
  });

  // Debugging: Log cart items and products to see what's available
  useEffect(()=>{
    if(userData.phoneNumber==="" || userData.addresses.length===0){
      toast.error("Please enter your Phone No. / Address")
      navigate("/profile")
    }
  },[])

  const totalPrice = cartItems.reduce((total, item) => {
    const product = productMap[item.id];
    if (!product) {
      console.warn(
        `Product with ID ${item.id} not found in available products. Skipping for total calculation.`
      );
      return total; // Or handle this error differently, e.g., show an alert
    }
    return total + product.price * item.qty;
  }, 0);

  const handleDeliveryAddress = (addId) => {
    setDeliverTo(addId);
    console.log("Selected delivery address ID:", addId);
  };

  const handlePlaceOrder = () => {
    if (!deliverTo) {
      // Replaced alert with a toast for consistent UI feedback
      toast.error("Please select a delivery address.");
      return;
    }
    if (!paymentMethod) {
      // Replaced alert with a toast for consistent UI feedback
      toast.error("Please select a payment method.");
      return;
    }
    // Logic to place the order
    console.log(
      "Order placed with delivery to:",
      deliverTo,
      "and payment method:",
      paymentMethod
    );
    // In a real application, you would send this data to your backend
    toast.success(`Order placed! Total: $${totalPrice.toFixed(2)}`); // Replaced alert with toast
    // You might want to clear the cart here or navigate to an order confirmation page
  };

  // --- Consolidated Loading and Error Handling ---
  if (authLoading || addressesLoading || productsLoading || cartLoading) {
    return <div className="text-center py-8">Loading checkout details...</div>;
  }

  // If auth has loaded and there's no current user, prompt to log in
  if (authLoading === false && !currentUser) {
    return (
      <div className="text-center py-12 text-red-700">
        <div className="text-2xl mb-4">
          You must be logged in to proceed to checkout.
        </div>
        {/* You could add a login button/link here */}
      </div>
    );
  }

  if (addressesError || productsError || cartError) {
    return (
      <div className="text-center py-8 text-red-700">
        Error loading checkout information:{" "}
        {addressesError?.message ||
          productsError?.message ||
          cartError?.message}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 sm:grid-cols-1">
      {/* Assuming Cart component correctly displays items based on cartItems and prods */}
      <Cart isOnCheckout={true} />
      <div className="m-8 flex flex-col gap-8">
        {/* --- Delivery Address Section --- */}
        <p className="text-2xl text-primary flex flex-row gap-1 items-center">
          <MapIcon size={24} /> Deliver To:{" "}
        </p>
        <div className="lg:mx-8 md:mx-5 sm:mx-2 mt-4 grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-2">
          {addresses.length === 0 ? (
            <p className="text-red-700">
              You don't have any addresses. Please add one to proceed.
            </p>
          ) : (
            addresses.map((address) => (
              <AddressCard
                key={address.id}
                showRadio={true}
                onRadio={() => handleDeliveryAddress(address.id)}
                houseNo={address.houseNo}
                street={address.street}
                locality={address.locality}
                pincode={address.pincode}
                city={address.city}
                state={address.state}
                showDelete={false}
                isSelected={deliverTo === address.id}
              />
            ))
          )}
        </div>
        // Payment Options Section (Enhanced)
        <div className="space-y-6">
          <p className="text-2xl text-primary flex items-center gap-2">
            <CreditCard size={24} />
            Payment Options:
          </p>

          <div className="grid grid-cols-1 gap-3">
            {[
              {
                id: "creditCard",
                label: "Credit/Debit Card",
                icon: <CreditCard className="text-blue-600" size={18} />,
              },
              {
                id: "payalot",
                label: "Pay-A-Lot",
                icon: <Wallet className="text-yellow-400" size={18} />,
              },
              {
                id: "bankTransfer",
                label: "Bank Transfer",
                icon: <Landmark className="text-green-600" size={18} />,
              },
              {
                id: "cashOnDelivery",
                label: "Cash on Delivery",
                icon: <HandCoins className="text-purple-600" size={18} />,
              },
            ].map((method) => (
              <label
                key={method.id}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === method.id
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {method.icon}
                <span className="flex-1">{method.label}</span>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={() => setPaymentMethod(method.id)}
                  className="h-4 w-4 accent-primary"
                />
              </label>
            ))}
          </div>
          <div className="flex flex-row-reverse">
            <button className="btn btn-outline text-white btn-warning text-xl">Place Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}
