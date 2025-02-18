import React, { useState } from "react";
import { FaMotorcycle, FaCalendarAlt, FaMoneyBillWave, FaClock, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const OrderPage = () => {
  // Dummy orders data
  const dummyOrders = [
    {
      id: "order1",
      bike: "Shine",
      totalPrice: 4500,
      rentalDays: 5,
      orderDate: new Date("2025-03-10").toLocaleDateString(),
      status: "Completed",
      orderId: "BKRTNT-001",
    },
    {
      id: "order2",
      bike: "Activa",
      totalPrice: 2800,
      rentalDays: 3,
      orderDate: new Date("2025-02-25").toLocaleDateString(),
      status: "Active",
      orderId: "BKRTNT-002",
    },
    {
      id: "order3",
      bike: "Shine",
      totalPrice: 3200,
      rentalDays: 4,
      orderDate: new Date("2025-02-27").toLocaleDateString(),
      status: "Pending",
      orderId: "BKRTNT-003",
    },
    {
      id: "order4",
      bike: "Splender",
      totalPrice: 1850,
      rentalDays: 2,
      orderDate: new Date("2025-03-01").toLocaleDateString(),
      status: "Canceled",
      orderId: "BKRTNT-004",
    },
    {
      id: "order5",
      bike: "Activa",
      totalPrice: 5200,
      rentalDays: 7,
      orderDate: new Date("2025-03-05").toLocaleDateString(),
      status: "Active",
      orderId: "BKRTNT-005",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-semibold text-center mb-6 text-orange-600">Your Orders</h1>

        {dummyOrders.length === 0 && (
          <p className="text-center text-gray-500">You have no orders yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyOrders.map((order, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <FaMotorcycle className="text-orange-500" /> {order.bike}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Order ID: <span className="font-semibold text-gray-700">{order.orderId}</span>
              </p>

              <div className="mt-4 space-y-2">
                <p className="flex items-center text-gray-700">
                  <FaMoneyBillWave className="text-green-500 mr-2" /> <strong>Price:</strong> ₹{order.totalPrice}
                </p>
                <p className="flex items-center text-gray-700">
                  <FaCalendarAlt className="text-blue-500 mr-2" /> <strong>Rental Days:</strong> {order.rentalDays}
                </p>
                <p className="flex items-center text-gray-700">
                  <FaClock className="text-yellow-500 mr-2" /> <strong>Order Date:</strong> {order.orderDate}
                </p>
                <p className="flex items-center text-gray-700">
                  <FaCheckCircle
                    className={`mr-2 ${order.status === "Completed" ? "text-green-500" : "text-red-500"}`}
                  />
                  <strong>Status:</strong> {order.status}
                </p>
              </div>

              {/* View Order Details Link */}
              <div className="mt-4 text-center">
                <Link
                  to={`/order/${order.id}`}
                  className="text-blue-500 hover:underline transition"
                >
                  View Order Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;