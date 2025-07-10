import React, { useState, useRef, useEffect } from 'react';
import { X, MapPin, Package, Calendar, DollarSign, ListOrdered } from 'lucide-react'; // Added icons for modal details

const OrderCard = ({ order }) => {
  const { id, items, totalAmount, orderDate, status, deliveryAddress } = order;
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const modalRef = useRef(null); // Ref for the DaisyUI dialog element

  // Get the first two items and the count of remaining items for the card display
  const displayedItems = items.slice(0, 2);
  const remainingCount = items.length - displayedItems.length;

  // Function to handle image loading errors, replacing with a placeholder
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop if placeholder also fails
    e.target.src = "https://placehold.co/64x64/cccccc/000000?text=N/A"; // Placeholder image
  };

  // Determine status badge styling for dark mode (for the card itself)
  const getStatusClasses = (currentStatus) => {
    switch (currentStatus) {
      case 'Delivered':
        return 'bg-green-700 text-green-100'; // Darker background, lighter text for dark mode
      case 'Shipped':
        return 'bg-blue-700 text-blue-100';   // Darker background, lighter text for dark mode
      case 'Pending':
        return 'bg-yellow-700 text-yellow-100'; // Darker background, lighter text for dark mode
      case 'Cancelled':
        return 'bg-red-700 text-red-100'; // Darker background, lighter text for dark mode
      default:
        return 'bg-gray-700 text-gray-100';
    }
  };

  // Determine status text color for the modal (which is light-themed)
  const getModalStatusTextClasses = (currentStatus) => {
    switch (currentStatus) {
      case 'Delivered':
        return 'text-green-600';
      case 'Shipped':
        return 'text-blue-600';
      case 'Pending':
        return 'text-yellow-600';
      case 'Cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Effect to manage DaisyUI modal's open/close state
  useEffect(() => {
    if (modalRef.current) {
      if (showModal) {
        modalRef.current.showModal();
      } else {
        modalRef.current.close();
      }
    }
  }, [showModal]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      {/* Main Order Card - Dark Mode */}
      <div
        className="bg-base-200 rounded-xl shadow-lg p-5 cursor-pointer hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 font-inter border border-base-300"
        onClick={openModal} // Open modal on card click
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3">
            {displayedItems.map((item, index) => (
              <img
                key={`${item.id}-${index}`}
                src={item.imageUrlAtOrder}
                alt={item.nameAtOrder || "Product Image"}
                className="w-20 h-20 object-cover rounded-lg border border-gray-700 shadow-sm"
                onError={handleImageError}
              />
            ))}
            {remainingCount > 0 && (
              <div className="flex items-center justify-center w-20 h-20 bg-gray-700 text-gray-300 font-semibold rounded-lg border border-gray-700 text-xl">
                +{remainingCount}
              </div>
            )}
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <p className="font-bold text-2xl text-white">₹{totalAmount}</p>
            <p className="text-sm text-gray-400">
              {orderDate && orderDate.seconds ? new Date(orderDate.seconds * 1000).toLocaleString() : 'N/A'}
            </p>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getStatusClasses(status)}`}>
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* DaisyUI Modal for Order Details */}
      <dialog ref={modalRef} id={`order_modal_${id}`} className="modal">
        <div className="modal-box p-6 md:p-8 rounded-xl shadow-2xl bg-base-200 text-base-content">
          {/* Close button */}
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
              onClick={closeModal}
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </form>

          <h3 className="font-bold text-2xl mb-4 flex items-center gap-2 text-primary">
            <ListOrdered size={24} /> Order Details <span className="text-base font-normal text-gray-500">#{id.substring(0, 8)}</span>
          </h3>

          {/* Order Summary in Modal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-400 mb-6 border-b border-base-200 pb-4">
            <div className="flex items-center gap-2">
              <DollarSign size={20} className="text-green-600" />
              <span className="font-semibold">Total Amount:</span> ₹{totalAmount}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-purple-600" />
              <span className="font-semibold">Order Date:</span> {orderDate && orderDate.seconds ? new Date(orderDate.seconds * 1000).toLocaleString() : 'N/A'}
            </div>
            <div className="flex items-center gap-2 col-span-full">
              <Package size={20} className="text-indigo-600" />
              <span className="font-semibold">Status:</span>
              <span className={`font-medium ${getModalStatusTextClasses(status)}`}>{status}</span>
            </div>
          </div>

          {/* Shipping Address in Modal */}
          {deliveryAddress && (
            <div className="mb-6 p-4 bg-base-200 rounded-lg border border-base-300"> {/* DaisyUI-like card styling */}
              <h4 className="text-xl font-semibold text-base-content mb-3 flex items-center gap-2">
                <MapPin size={22} className="text-primary" /> Shipping Address:
              </h4>
              <p className="text-base-content/80">
                {deliveryAddress.houseNo}, {deliveryAddress.street}, {deliveryAddress.locality},<br />
                {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}
              </p>
            </div>
          )}

          {/* Items List in Modal */}
          <h4 className="text-xl font-semibold text-base-content mb-4 flex items-center gap-2">
            <ListOrdered size={22} className="text-primary" /> Ordered Items:
          </h4>
          <ul className="space-y-3 max-h-60 overflow-y-auto pr-2"> {/* Added max-height and scroll */}
            {items.map((item, index) => (
              <li key={`${item.id}-${index}-modal`} className="flex items-center justify-between p-3 bg-base-100 rounded-lg shadow-sm border border-base-200">
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrlAtOrder}
                    alt={item.nameAtOrder || "Product Image"}
                    className="w-16 h-16 object-cover rounded-md border border-base-300"
                    onError={handleImageError}
                  />
                  <div>
                    <span className="font-medium text-base-content">{item.nameAtOrder}</span>
                    <span className="text-sm text-base-content/80 block">Qty: {item.qty}</span>
                  </div>
                </div>
                <span className="font-bold text-lg text-base-content">₹{(item.priceAtOrder * item.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          {/* Modal Action Buttons (DaisyUI style) */}
          <div className="modal-action mt-6">
            <form method="dialog">
              <button className="btn btn-primary" onClick={closeModal}>Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default OrderCard;
