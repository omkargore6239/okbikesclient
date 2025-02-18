import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const bikes = [
  { id: 1, name: "Honda Shine", basePrice: 599, img: "/bikes/Hondashine.jpg", type: "Manual", seating: "2-Seater", fuel: "Petrol", deposit: 500, makeYear: 2018, locations: ["Hadapsar", "Wakad"] },
  { id: 2, name: "Honda Activa 5G", basePrice: 399, img: "/bikes/activa.jpg", type: "Automatic", seating: "2-Seater", fuel: "Petrol", deposit: 500, makeYear: 2019, locations: ["Wakad", "Kothrud"] },
  { id: 3, name: "Hero Splender", basePrice: 299, img: "/bikes/splender.jpg", type: "Automatic", seating: "2-Seater", fuel: "Petrol", deposit: 500, makeYear: 2020, locations: ["Kothrud", "Hadapsar"] },
  { id: 4, name: "Ola Electric", basePrice: 999, img: "/bikes/ola.jpg", type: "Manual", seating: "2-Seater", fuel: "Petrol", deposit: 500, makeYear: 2017, locations: ["Wakad"] },
];

const BikeList = () => {
  const navigate = useNavigate();
  const [filteredBikes, setFilteredBikes] = useState(bikes);
  const [selectedFilters, setSelectedFilters] = useState({ transmissionType: [], fuelType: [], location: "" });
  const [sortOrder, setSortOrder] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    if (showFilters && filterRef.current) {
      filterRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showFilters]);

  const toggleFilter = (filterArray, value) =>
    filterArray.includes(value) ? filterArray.filter((item) => item !== value) : [...filterArray, value];

  const updateFilters = (filterType, value) => {
    const newFilters = { ...selectedFilters };
    if (filterType === "transmissionType") newFilters.transmissionType = toggleFilter(newFilters.transmissionType, value);
    else if (filterType === "fuelType") newFilters.fuelType = toggleFilter(newFilters.fuelType, value);
    else if (filterType === "location") newFilters.location = value;
    setSelectedFilters(newFilters);
    applyFilters(newFilters, sortOrder);
  };

  const sortBikes = (order) => {
    setSortOrder(order);
    applyFilters(selectedFilters, order);
  };

  const applyFilters = (filters, order) => {
    let result = bikes;
    if (filters.transmissionType.length > 0) result = result.filter((bike) => filters.transmissionType.includes(bike.type));
    if (filters.fuelType.length > 0) result = result.filter((bike) => filters.fuelType.includes(bike.fuel));
    if (filters.location) result = result.filter((bike) => bike.locations.includes(filters.location));
    if (order === "asc") result = result.sort((a, b) => a.basePrice - b.basePrice);
    if (order === "desc") result = result.sort((a, b) => b.basePrice - a.basePrice);
    setFilteredBikes(result);
  };

  return (
    <div className="container mx-auto py-6 flex flex-col lg:flex-row relative">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden fixed bottom-4 left-4 bg-orange-500 text-white p-3 square  shadow-lg z-50 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span></span>
      </button>

      {/* Filter Section */}
      <aside
        ref={filterRef}
        className={`w-full lg:w-1/4 bg-gray-100 p-4 -lg mb-6 lg:mb-0 transition-transform duration-300 ease-in-out ${
          showFilters ? "block" : "hidden lg:block"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
          <button
            onClick={() => setShowFilters(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-sm text-gray-700">Transmission Type</h4>
          <label className="flex items-center mb-2 text-sm">
            <input type="checkbox" className="mr-2" onChange={() => updateFilters("transmissionType", "Manual")} /> Gear
          </label>
          <label className="flex items-center text-sm">
            <input type="checkbox" className="mr-2" onChange={() => updateFilters("transmissionType", "Automatic")} /> Gearless
          </label>
        </div>
        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-sm text-gray-700">Fuel Type</h4>
          <label className="flex items-center mb-2 text-sm">
            <input type="checkbox" className="mr-2" onChange={() => updateFilters("fuelType", "Petrol")} /> Petrol
          </label>
          <label className="flex items-center text-sm">
            <input type="checkbox" className="mr-2" onChange={() => updateFilters("fuelType", "Electric")} /> Electric
          </label>
        </div>
        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-sm text-gray-700">Location</h4>
          <select
            className="w-full p-3 border-2 border-gray-300 bg-white text-gray-700 text-sm transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-2 focus:outline-none"
            onChange={(e) => updateFilters("location", e.target.value)}
          >
            <option value="">All</option>
            <option value="Hadapsar">Hadapsar</option>
            <option value="Wakad">Wakad</option>
            <option value="Kothrud">Kothrud</option>
          </select>
        </div>
        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-sm text-gray-700">Sort By Price</h4>
          <button className="block w-full mb-2 p-2 bg-orange-300 text-white" onClick={() => sortBikes("asc")}>
            Low to High
          </button>
          <button className="block w-full p-2 bg-orange-300 text-white" onClick={() => sortBikes("desc")}>
            High to Low
          </button>
        </div>
      </aside>

      {/* Bike Listing */}
      <main className="w-full lg:w-3/4 pl-0 lg:pl-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBikes.map((bike) => (
            <div key={bike.id} className="bg-white border p-4 shadow-md hover:shadow-xl transition-shadow">
              <img src={bike.img} alt={bike.name} className="w-full h-40 object-cover rounded-t-lg" />
              <h3 className="text-base font-medium mt-2 truncate">{bike.name}</h3>
              <p className="text-xs text-gray-600 mt-1">Year: {bike.makeYear}</p>
              
              <div className="mt-3 text-sm font-semibold text-gray-700">Available at</div>
              <select className="w-full p-2 mt-1 border-2 bg-gray-50 text-gray-700 hover:bg-gray-100">
                {bike.locations.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </select>

              <p className="text-sm font-semibold mt-3">Price: ₹{bike.basePrice} / day</p>
              <p className="text-xs text-gray-600 mt-1">Fuel excluded, No distance limit</p>
              {bike.id === 4 ? (
                <button className="mt-3 w-full bg-gray-500 text-white py-1 px-2 opacity-75 cursor-not-allowed transition-opacity" disabled>
                  Coming Soon
                </button>
              ) : (
                <button
                  className="mt-3 w-full bg-orange-500 text-white py-1 px-2 hover:bg-orange-600 transition-colors"
                  onClick={() => navigate(`/bike-details`, { state: bike })}
                >
                  Rent Now
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BikeList;