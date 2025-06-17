import React, { useEffect, useState } from "react";
import axios from "axios";
import CollectionCarCard from "../Components/CollectionCarCard";
import { useNavigate } from "react-router";
import SideBar from "../Components/SideBar";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    seats: "default",
    ac: "default",
    fuelType: "default",
    transmission: "default",
    priceOrder: "default",
    brand: "default",
    permited_city: "default",
    availability: "default",
  });
  const validCities = [
    "chennai",
    "coimbatore",
    "madurai",
    "trichy",
    "hyderbad",
    "banglore",
    "kochi",
    "goa",
    "cdm",
  ];

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(
          `https://be-go-rental-hbsq.onrender.com/dashboard/cars-renter?email=${email}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.data.cars || !Array.isArray(response.data.cars)) {
          throw new Error("Invalid response format: 'cars' array not found");
        }

        const fetchedCars = response.data.cars.map((car) => {
          let brand = "Other";
          if (["Nexon", "Punch", "Altroz"].includes(car.name)) brand = "Tata";
          else if (["Swift", "Baleno"].includes(car.name))
            brand = "Maruti Suzuki";
          else if (car.name === "Comet") brand = "MG";
          else if (car.name === "Thar") brand = "Mahindra";
          else if (car.name === "Creta") brand = "Hyundai";
          else if (car.name === "Vento") brand = "Volkswagen";
          else if (car.name === "Civic") brand = "Honda";
          else if (car.name === "Toyota Camry") brand = "Toyota";

          return {
            id: car._id,
            price: car.priceperday,
            car_name: car.name,
            ac: car.ac,
            passengers: car.passengers,
            transmission: car.transmission,
            seats: car.seats,
            fuelType: car.fuelType,
            car_png: car.image
              ? `https://be-go-rental-hbsq.onrender.com/${car.image.replace(
                  /\\/g,
                  "/"
                )}`
              : "https://via.placeholder.com/200x150",
            doors: car.doors,
            carNumber: car.carNumber,
            from: car.from,
            to: car.to,
            ratings: car.ratings,
            reviews: car.reviews,
            permited_city: validCities.includes(car.permited_city)
              ? car.permited_city
              : "N/A",
            brand: brand.toLowerCase(),
          };
        });
        setVehicles(fetchedCars);
        setFilteredVehicles(fetchedCars);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setError("Failed to load vehicles. Please try again later.");
      }
    };

    fetchVehicles();
  }, []);

  const handleUpdate = (carId) => {
    navigate(`/edit-car/${carId}`);
  };

  const handleDelete = async (carId) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        const response = await axios.delete(
          `https://be-go-rental-hbsq.onrender.com/dashboard/car-delete/${carId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setVehicles(vehicles.filter((v) => v.id !== carId));
          setFilteredVehicles(filteredVehicles.filter((v) => v.id !== carId));
        } else {
          setError(response.data.message || "Failed to delete car.");
        }
      } catch (error) {
        console.error("Error deleting car:", error);
        setError("Failed to delete car. Please try again.");
      }
    }
  };

  const handleRent = (carId) => {
    navigate(`/rent-car/${carId}`);
  };

  function handleclick() {
    navigate("/addcar");
  }

  useEffect(() => {
    let filtered = [...vehicles];

    if (filters.seats !== "default") {
      filtered = filtered.filter((v) => v.seats.toString() === filters.seats);
    }

    if (filters.ac !== "default") {
      const acBool = filters.ac === "true";
      filtered = filtered.filter((v) => v.ac === acBool);
    }

    if (filters.fuelType !== "default") {
      filtered = filtered.filter((v) => v.fuelType === filters.fuelType);
    }

    if (filters.transmission !== "default") {
      filtered = filtered.filter(
        (v) => v.transmission === filters.transmission
      );
    }

    if (filters.brand !== "default") {
      filtered = filtered.filter((v) => v.brand === filters.brand);
    }

    if (filters.permited_city !== "default") {
      filtered = filtered.filter(
        (v) => v.permited_city === filters.permited_city
      );
    }

    if (filters.availability !== "default") {
      const now = new Date();
      if (filters.availability === "available") {
        filtered = filtered.filter((v) => {
          const fromDate = new Date(v.from);
          const toDate = new Date(v.to);
          return fromDate <= now && toDate >= now;
        });
      } else if (filters.availability === "unavailable") {
        filtered = filtered.filter((v) => {
          const fromDate = new Date(v.from);
          const toDate = new Date(v.to);
          return fromDate > now || toDate < now;
        });
      }
    }

    // Sorting
    if (filters.priceOrder === "high") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else if (filters.priceOrder === "low") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    }

    setFilteredVehicles(filtered);
  }, [filters, vehicles]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <SideBar />
      <div className="pt-[13vh] min-h-screen bg-gray-100">
        <div className="flex">
          <div className="hidden sm:flex sm:flex-col h-screen w-64 border-r pr-5 gap-5 pt-10 pl-3 fixed rounded bg-gray-200 shadow-md">
            <SelectFilter
              name="seats"
              value={filters.seats}
              onChange={handleFilterChange}
              options={["3", "4", "5", "6"]}
            />
            <SelectFilter
              name="ac"
              value={filters.ac}
              onChange={handleFilterChange}
              options={[
                ["true", "AC"],
                ["false", "Non-AC"],
              ]}
            />
            <SelectFilter
              name="fuelType"
              value={filters.fuelType}
              onChange={handleFilterChange}
              options={["Petrol", "Diesel", "Electric"]}
            />
            <SelectFilter
              name="transmission"
              value={filters.transmission}
              onChange={handleFilterChange}
              options={["Auto", "Manual"]}
            />
            <SelectFilter
              name="priceOrder"
              value={filters.priceOrder}
              onChange={handleFilterChange}
              options={[
                ["high", "Price-High-Low"],
                ["low", "Price-Low-High"],
              ]}
            />
            <SelectFilter
              name="brand"
              value={filters.brand}
              onChange={handleFilterChange}
              options={[
                "honda",
                "tata",
                "maruti suzuki",
                "mg",
                "mahindra",
                "hyundai",
                "volkswagen",
                "toyota",
                "other",
              ]}
            />
            <SelectFilter
              name="permited_city"
              value={filters.permited_city}
              onChange={handleFilterChange}
              options={validCities.map((city) => [
                city,
                city.charAt(0).toUpperCase() + city.slice(1),
              ])}
            />
            <SelectFilter
              name="availability"
              value={filters.availability}
              onChange={handleFilterChange}
              options={[
                ["available", "Available Now"],
                ["unavailable", "Unavailable Now"],
              ]}
            />
            <div className="flex flex-col gap-2">
              <button
                className="bg-black rounded px-2 py-1 text-white"
                onClick={handleclick}
              >
                New Request
              </button>
            </div>
          </div>

          <div
            className={`sm:hidden w-full bg-gray-200 ${
              isOpen ? "h-auto" : "h-12"
            } border-b rounded shadow-md transition-all duration-200`}
          >
            <div
              className="flex items-center gap-2 pl-3 pt-2 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="font-semibold text-gray-800">FILTERS</div>
              <div>
                {isOpen ? (
                  <svg className="size-6" viewBox="0 0 24 24" fill="none">
                    <path
                      d="m4.5 5.25 7.5 7.5 7.5-7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg className="size-6" viewBox="0 0 24 24" fill="none">
                    <path
                      d="m5.25 4.5 7.5 7.5-7.5 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>

            {isOpen && (
              <div className="flex flex-col px-3 py-5 gap-3">
                <SelectFilter
                  name="seats"
                  value={filters.seats}
                  onChange={handleFilterChange}
                  options={["3", "4", "5", "6"]}
                />
                <SelectFilter
                  name="ac"
                  value={filters.ac}
                  onChange={handleFilterChange}
                  options={[
                    ["true", "AC"],
                    ["false", "Non-AC"],
                  ]}
                />
                <SelectFilter
                  name="fuelType"
                  value={filters.fuelType}
                  onChange={handleFilterChange}
                  options={["Petrol", "Diesel", "Electric"]}
                />
                <SelectFilter
                  name="transmission"
                  value={filters.transmission}
                  onChange={handleFilterChange}
                  options={["Auto", "Manual"]}
                />
                <SelectFilter
                  name="priceOrder"
                  value={filters.priceOrder}
                  onChange={handleFilterChange}
                  options={[
                    ["high", "Price-High-Low"],
                    ["low", "Price-Low-High"],
                  ]}
                />
                <SelectFilter
                  name="brand"
                  value={filters.brand}
                  onChange={handleFilterChange}
                  options={[
                    "honda",
                    "tata",
                    "maruti suzuki",
                    "mg",
                    "mahindra",
                    "hyundai",
                    "volkswagen",
                    "toyota",
                    "other",
                  ]}
                />
                <SelectFilter
                  name="permited_city"
                  value={filters.permited_city}
                  onChange={handleFilterChange}
                  options={validCities.map((city) => [
                    city,
                    city.charAt(0).toUpperCase() + city.slice(1),
                  ])}
                />
                <SelectFilter
                  name="availability"
                  value={filters.availability}
                  onChange={handleFilterChange}
                  options={[
                    ["available", "Available Now"],
                    ["unavailable", "Unavailable Now"],
                  ]}
                />
              </div>
            )}
          </div>

          <div className="sm:ml-64 p-6 w-full">
            {error ? (
              <p className="text-red-600 text-center">{error}</p>
            ) : filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <CollectionCarCard
                    key={vehicle.id}
                    price={vehicle.price}
                    car_name={vehicle.car_name}
                    ac={vehicle.ac}
                    passengers={vehicle.passengers}
                    transmission={vehicle.transmission}
                    seats={vehicle.seats}
                    fuelType={vehicle.fuelType}
                    car_png={vehicle.car_png}
                    doors={vehicle.doors}
                    carNumber={vehicle.carNumber}
                    from={vehicle.from}
                    to={vehicle.to}
                    ratings={vehicle.ratings}
                    reviews={vehicle.reviews}
                    permited_city={vehicle.permited_city}
                    onUpdate={() => handleUpdate(vehicle.id)}
                    onDelete={() => handleDelete(vehicle.id)}
                    onRent={() => handleRent(vehicle.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">No vehicles found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const SelectFilter = ({ name, value, onChange, options }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    className="border rounded px-4 py-2 text-gray-700 bg-white hover:outline hover:outline-indigo-500 focus:outline-indigo-500 transition-all"
  >
    <option value="default">{name[0].toUpperCase() + name.slice(1)}</option>
    {options.map((option) =>
      Array.isArray(option) ? (
        <option key={option[0]} value={option[0]}>
          {option[1]}
        </option>
      ) : (
        <option key={option} value={option}>
          {option}
        </option>
      )
    )}
  </select>
);

export default Vehicles;
