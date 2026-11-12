import React, { useState, useEffect } from "react";
import axiosInstance from "../../../API/axiosInstance";
import { load } from "@cashfreepayments/cashfree-js";

const PACKAGES = [
  {
    name: "Pro",
    description: "Perfect for small businesses starting with identity verification.",
    price: "₹5,000",
    units: "100 Verification Units",
    features: ["Basic ID Check", "Email Verification", "Standard Support"],
    popular: false,
  },
  {
    name: "Premium",
    description: "Our most popular tier for growing companies and HR teams.",
    price: "₹16,000",
    units: "500 Verification Units",
    features: ["Advanced ID Check", "Education Verification", "Past Employment Check", "Priority Support"],
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Comprehensive screening suite for enterprise compliance.",
    price: "₹60,000",
    units: "1500 Verification Units",
    features: ["Global Watchlist Check", "Criminal Record Check", "Financial Credit Check", "24/7 Dedicated Support"],
    popular: false,
  },
];

import { useLocation, useNavigate } from "react-router-dom";

export default function PurchaseCredits() {
  const [loading, setLoading] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [financeEmail, setFinanceEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pkgToPurchase, setPkgToPurchase] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const orderId = query.get("order_id");
    
    if (orderId) {
      const verifyPayment = async () => {
        try {
          const { data } = await axiosInstance.post("/api/client-admin/billing/verify", {
            order_id: orderId
          });
          if (data.success) {
            alert("Payment Successful! Units have been added to your balance.");
            // Remove order_id from url to prevent re-verify
            navigate("/client-admin/billing", { replace: true });
          }
        } catch (error) {
          console.error("Verification failed", error);
          alert("Payment verification failed or payment is pending.");
          navigate("/client-admin/billing", { replace: true });
        }
      };
      verifyPayment();
    }
  }, [location.search, navigate]);

  const onPurchaseClick = (pkg) => {
    setPkgToPurchase(pkg);
    setShowEmailPopup(true);
    setEmailError("");
    setSuccessMessage("");
  };

  const handlePurchase = async () => {
    if (!financeEmail) {
      setEmailError("Please enter the finance department email.");
      return;
    }

    setLoading(true);
    const pkg = pkgToPurchase;
    setSelectedPkg(pkg.name);
    try {
      const amount = parseInt(pkg.price.replace(/[^0-9]/g, ''), 10);
      
      const { data } = await axiosInstance.post("/api/client-admin/billing/send-payment-link", {
        amount,
        customerEmail: financeEmail, 
        packageId: pkg.name
      }, { withCredentials: true });
      
      if (data.success) {
        setSuccessMessage("Payment link has been successfully sent to the finance department.");
        setFinanceEmail("");
      } else {
        setEmailError("Failed to send payment link");
      }
    } catch (error) {
      console.error("Purchase error", error);
      alert("Error initiating purchase. Please try again.");
    } finally {
      setLoading(false);
      setSelectedPkg(null);
    }
  };

  return (
    <div className="py-8">

      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Package</h2>
        <p className="text-sm text-gray-500 leading-6">
          Select The Verification Package That Best Fits Your Company's Hiring Volume.<br />
          Units Never Expire And Are Added Instantly To Your Balance.
        </p>
      </div>

      {/* Cards Row */}
      <div className="flex gap-6 justify-center items-stretch flex-wrap">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.name}
            className={`relative flex flex-col flex-1 min-w-65 max-w-[320px] bg-white rounded-2xl p-7
              ${pkg.popular
                ? "border-2 border-indigo-500 shadow-md"
                : "border border-gray-200 shadow-sm"
              }`}
          >

            {/* Most Popular Badge — sits on top border */}
            {pkg.popular && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-indigo-600 text-white text-xs font-bold px-5 py-2 rounded-full tracking-widest uppercase whitespace-nowrap shadow">
                  MOST POPULAR
                </span>
              </div>
            )}

            {/* Extra top spacing for popular card so content isn't hidden under badge */}
            <div className={pkg.popular ? "mt-3" : ""}>

              {/* Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{pkg.description}</p>

              {/* Price */}
              <p className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">{pkg.price}</p>

              {/* Units Badge */}
              <div className="mb-5">
                <span className="bg-indigo-50 text-indigo-500 text-xs font-medium px-4 py-1.5 rounded-full inline-block">
                  {pkg.units}
                </span>
              </div>

              {/* Divider */}
              <hr className="border-gray-200 mb-5" />

              {/* Features */}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-gray-800">
                    <span className="text-green-500 font-bold text-base">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Spacer pushes button to bottom */}
            <div className="flex-1" />

            {/* CTA Button */}
            <button
              onClick={() => onPurchaseClick(pkg)}
              disabled={loading}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer mt-4
                ${pkg.popular
                  ? "bg-indigo-700 text-white hover:bg-indigo-800"
                  : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                } ${loading && selectedPkg === pkg.name ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {loading && selectedPkg === pkg.name ? "Processing..." : "Purchase Package"}
            </button>

          </div>
        ))}
      </div>

      {/* Email Popup Modal */}
      {showEmailPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-[2px]">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Finance Department Email</h3>
            <p className="text-sm text-gray-500 mb-4">
              Please provide the finance department email to proceed with the purchase.
            </p>
            <input
              type="email"
              value={financeEmail}
              onChange={(e) => {
                setFinanceEmail(e.target.value);
                setEmailError("");
              }}
              placeholder="finance@company.com"
              className={`w-full border ${emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} rounded-lg px-4 py-2 ${emailError ? 'mb-1' : 'mb-6'} focus:outline-none focus:ring-2`}
            />
            {emailError && <p className="text-red-500 text-sm mb-5">{emailError}</p>}
            {successMessage && <p className="text-green-600 text-sm font-medium mb-5">{successMessage}</p>}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEmailPopup(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                {successMessage ? "Close" : "Cancel"}
              </button>
              {!successMessage && (
                <button
                  onClick={handlePurchase}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Email"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}