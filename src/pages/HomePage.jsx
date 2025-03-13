import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../context/GlobalStateContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useGlobalState();

  const [errors, setErrors] = useState({});
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    // "/bikes/freedom.jpg",
    "/bikes/freedom1.avif",
    "/bikes/freedom2.avif"
  ];

  // Format Date Function
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);

    setFormData((prevData) => ({
      ...prevData,
      location: "Pune",
      startDate: formatDateForInput(currentDate),
      endDate: formatDateForInput(tomorrow),
    }));

    // Image sliding effect every 4 seconds
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [setFormData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (name === "startDate") {
        const startDate = new Date(value);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        return {
          ...prevData,
          startDate: value,
          endDate: formatDateForInput(endDate),
        };
      }
      return { ...prevData, [name]: value };
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSearch = () => {
    const newErrors = {};
    if (!formData.startDate) newErrors.startDate = "Start Date is required.";
    if (!formData.endDate) newErrors.endDate = "End Date is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      navigate("/bike-list");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute top-0 left-0 w-full h-full">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100 scale-105" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60"></div>

      {/* Form Section */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-4">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-lg animate-fade-in-down">
          Welcome to <span className="text-orange-500">OK Bikes</span>
        </h1>

        {/* Form */}
        <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full max-w-md animate-fade-in-up">
          {/* Location */}
          <div className="mb-4">
            <label
              className="block text-white font-medium mb-2"
              htmlFor="location"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              disabled
              className="w-full px-4 py-2 border rounded-md outline-none bg-gray-100 border-gray-300"
            />
          </div>

          {/* Start Date */}
          <div className="mb-4">
            <label
              className="block text-white font-medium mb-2"
              htmlFor="startDate"
            >
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.startDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>

          {/* End Date */}
          <div className="mb-6">
            <label
              className="block text-white font-medium mb-2"
              htmlFor="endDate"
            >
              End Date & Time
            </label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.endDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSearch}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-md font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
          >
            Search Bikes
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
