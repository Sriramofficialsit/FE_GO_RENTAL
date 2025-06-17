import React from "react";
import axios from "axios";

const AdminCard1 = ({ carData, dispatch, onStatusChange }) => {
  const formatDate = (dateString) => {
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
    const [day, month, year] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleApprove = async () => {
    try {
      console.log("Approving request with ID:", carData._id);
      const response = await axios.put(
        `https://be-go-rental-hbsq.onrender.com/api/approvals/approve/${carData._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Approve response:", response.data);
      alert("Request approved successfully!");
      dispatch({
        type: "UPDATE_REQUEST_STATUS",
        payload: { id: carData._id, status: "approved" },
      });
    } catch (error) {
      console.error(
        "Error approving request:",
        error.response?.data || error.message
      );
      alert(
        "Failed to approve request: " +
          (error.response?.data?.message || error.message)
      );
      onStatusChange();
    }
  };

  const handleDisapprove = async () => {
    try {
      console.log("Disapproving request with ID:", carData._id);
      const response = await axios.put(
        `https://be-go-rental-hbsq.onrender.com/api/approvals/disapprove/${carData._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Disapprove response:", response.data);
      alert("Request disapproved successfully!");
      dispatch({
        type: "UPDATE_REQUEST_STATUS",
        payload: { id: carData._id, status: "disapproved" },
      });
    } catch (error) {
      console.error(
        "Error disapproving request:",
        error.response?.data || error.message
      );
      alert(
        "Failed to disapprove request: " +
          (error.response?.data?.message || error.message)
      );
      onStatusChange();
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-r from-yellow-50 to-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.01] border-l-4 border-yellow-500 animate-fade-in">
      <div className="absolute top-3 right-3 bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
        Pending
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
                  {carData.carNumber.toUpperCase()}
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
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
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
            <div className="flex gap-2">
              <button
                onClick={handleApprove}
                className="bg-green-500 text-white px-4 py-1 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm"
              >
                Approve
              </button>
              <button
                onClick={handleDisapprove}
                className="bg-red-500 text-white px-4 py-1 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm"
              >
                Disapprove
              </button>
            </div>
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
