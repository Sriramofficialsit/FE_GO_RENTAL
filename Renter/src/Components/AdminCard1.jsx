import React from "react";

const AdminCard1 = ({ carData }) => {
  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRentalDate = (dateString) => {
    if (!dateString) return "N/A";
    const [day, month, year] = dateString.split("-");
    if (!day || !month || !year) return "N/A";
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="relative w-full bg-gradient-to-r from-green-50 to-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.01] border-l-4 border-green-500 animate-fade-in">
      <div className="absolute top-3 right-3 bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
        Pending Approval
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 p-4">
          <img
            src={`https://be-go-rental-hbsq.onrender.com/${carData.image}`}
            alt={`${carData.car_model}`}
            className="w-full h-40 object-cover rounded-lg transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.target.src = "/path/to/fallback-image.jpg";
            }}
          />
        </div>

        <div className="md:w-3/4 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
              {carData.car_model} ({carData.modelYear})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-gray-700 text-sm">
              <div>
                <p className="mb-1">
                  <span className="font-semibold text-gray-800">Owner:</span>{" "}
                  {carData.name}
                </p>
                <p className="mb-1">
                  <span className="font-semibold text-gray-800">Email:</span>{" "}
                  {carData.email}
                </p>
                <p className="mb-1">
                  <span className="font-semibold text-gray-800">Phone:</span>{" "}
                  {carData.phone}
                </p>
                <p className="mb-1">
                  <span className="font-semibold text-gray-800">
                    Car Number:
                  </span>{" "}
                  {carData.carNumber?.toUpperCase()}
                </p>
                <p className="mb-1">
                  <span className="font-semibold text-gray-800">AC:</span>{" "}
                  {carData.ac ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="mb-1">
                  <span className="font-semibold text-gray-800">
                    Passengers:
                  </span>{" "}
                  {carData.passengers}
                </p>
                <p className="mb-1">
                  <span className="font-semibold text-gray-800">
                    Transmission:
                  </span>{" "}
                  {carData.transmission}
                </p>
                <p className="mb-1">
                  <span className="font-semibold text-gray-800">
                    Fuel Type:
                  </span>{" "}
                  {carData.fuelType}
                </p>
                <p className="mb-1">
                  <span className="font-semibold text-gray-800">Ratings:</span>{" "}
                  {carData.ratings}/5
                </p>
                <p className="mb-1">
                  <span className="font-semibold text-gray-800">Reviews:</span>{" "}
                  {carData.reviews}
                </p>
              </div>
              <div>
                <p className="mb-1">
                  <span className="font-semibold text-gray-800">Seats:</span>{" "}
                  {carData.seats}
                </p>
                <p className="mb-1">
                  <span className="font-semibold text-gray-800">Doors:</span>{" "}
                  {carData.doors}
                </p>
                <p className="mb-1">
                  <span className="font-semibold text-gray-800">Price:</span> ₹
                  {carData.priceperday}/day
                </p>
                <p className="mb-1">
                  <span className="font-semibold text-gray-800">
                    Rental Period:
                  </span>{" "}
                  {formatRentalDate(carData.from)} to{" "}
                  {formatRentalDate(carData.to)}
                </p>
                <p className="mb-1">
                  <span className="font-semibold text-gray-800">
                    Submitted:
                  </span>{" "}
                  {formatDate(carData.createdAt)}
                </p>
                <p className="mb-1">
                  <span className="font-semibold text-gray-800">Approved:</span>{" "}
                  {formatDate(carData.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <a
              href={`https://be-go-rental-hbsq.onrender.com/${carData.rc_book}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300 hover:underline"
            >
              View RC Book
            </a>
            <span className="text-gray-300">|</span>
            <a
              href={`https://be-go-rental-hbsq.onrender.com/${carData.insurance}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300 hover:underline"
            >
              View Insurance
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminCard1;
