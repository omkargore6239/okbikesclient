import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGlobalState } from "../context/GlobalStateContext";
import { FaRegCalendarAlt, FaClock, FaMapMarkerAlt, FaClipboardCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addOrder } = useGlobalState();

  const [checkoutData, setCheckoutData] = useState(location.state || {});
  const [loadingData, setLoadingData] = useState(true);

  const [couponCode, setCouponCode] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!location.state || Object.keys(location.state).length === 0) {
      const savedData = sessionStorage.getItem('checkoutData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setCheckoutData(parsedData);
        navigate(location.pathname, { state: parsedData, replace: true });
      }
    }
    setLoadingData(false);
  }, [location.state, navigate, location.pathname]);

  const { 
    bike = {}, 
    totalPrice = 0, 
    rentalDays = 1, 
    selectedPackage = {}, 
    addressDetails = {}, 
    pickupOption = "Self Pickup",
    pickupDate = new Date(), 
    dropDate = new Date() 
  } = checkoutData;

  const coupons = { SAVE10: 10, RENT20: 20 };
  const depositAmount = bike?.deposit || 0;
  const deliveryCharge = pickupOption === "Delivery at Location" ? 250 : 0;
  const serviceCharge = 2;

  const handleApplyCoupon = () => {
    if (coupons[couponCode.toUpperCase()]) {
      const discountPercent = coupons[couponCode.toUpperCase()];
      setDiscount((totalPrice * discountPercent) / 100);
    } else {
      setDiscount(0);
      alert("Invalid Coupon Code");
    }
  };

  const payableAmount = Math.max(0, (totalPrice + depositAmount + deliveryCharge + serviceCharge) - discount);

  const handlePayment = async () => {
    if (!termsAccepted) {
      alert("Please accept the terms and conditions");
      return;
    }

    setIsProcessing(true);

    try {
      const bookingDetails = {
        bikeId: bike._id, // Changed to match common MongoDB field names
        bikeModel: bike.model,
        package: selectedPackage,
        rentalDays,
        totalPrice: payableAmount,
        deposit: depositAmount,
        deliveryCharge,
        serviceCharge,
        discount,
        pickupDate: new Date(pickupDate),
        dropDate: new Date(dropDate),
        addressDetails,
        paymentMethod: "Pay at Center",
        status: "Confirmed",
      };

      const response = await axios.post("/api/bookings", bookingDetails); // Use proxy in package.json

      if (response.status === 201) { // Updated to match common REST 201 Created status
        setBookingConfirmed(true);
        addOrder({
          id: response.data._id,
          bike: bike.model,
          rentalDays,
          totalPrice: payableAmount,
          orderDate: new Date().toISOString(),
          status: "Confirmed",
        });
        
        // Clear session storage after successful booking
        sessionStorage.removeItem('checkoutData');
        
        setTimeout(() => navigate("/orders"), 2000);
      }
    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message);
      alert(`Booking failed: ${error.response?.data?.message || "Server error"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loadingData) {
    return <div className="text-center py-8">Loading booking details...</div>;
  }

  if (!bike || Object.keys(bike).length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">No Booking Data Found</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto py-8 px-4 lg:px-8 flex-grow">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-6 space-y-6">
            {/* ... (keep existing JSX structure unchanged) ... */}
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
            {/* Coupon Section */}
            <div className="space-y-4">
              {/* ... (keep existing coupon JSX unchanged) ... */}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Price Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>₹{selectedPackage?.price * rentalDays}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>₹{deliveryCharge}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee:</span>
                  <span>₹{serviceCharge}</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Deposit:</span>
                  <span>₹{depositAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-₹{discount}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total Payable:</span>
                  <span>₹{payableAmount}</span>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="h-4 w-4"
                />
                <span className="text-sm">I agree to terms & conditions</span>
              </div>
              <button
                onClick={handlePayment}
                disabled={!termsAccepted || isProcessing}
                className={`w-full py-2 px-4 rounded-lg transition-colors ${
                  !termsAccepted || isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                {isProcessing ? "Processing..." : `Confirm Booking - ₹${payableAmount}`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Animation */}
      {bookingConfirmed && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white p-8 rounded-lg text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <FaClipboardCheck className="text-6xl text-green-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600">Redirecting to orders page...</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CheckoutPage;