import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../Components/SideBar";

const Transactions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userEmail = localStorage.getItem("email");
        if (!userEmail) {
          throw new Error("No user email found in localStorage");
        }

        const response = await fetch(
          `https://be-go-rental-hbsq.onrender.com/api/payments?count=${itemsPerPage}&skip=${
            (page - 1) * itemsPerPage
          }`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch transactions: ${response.statusText}`
          );
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(
            data.error + (data.details ? `: ${data.details}` : "")
          );
        }

        const userTransactions = data.items.filter(
          (item) => item.email === userEmail
        );

        setTotalCount(userTransactions.length);

        const uniqueTransactions = Array.from(
          new Map(userTransactions.map((item) => [item.id, item])).values()
        );

        const formattedTransactions = uniqueTransactions.map((item) => ({
          id: item.id,
          username: item.email.split("@")[0] || "Unknown User",
          email: item.email,
          mobile: item.contact,
          amount: `₹${(item.amount / 100).toFixed(2)}`,
          status: item.status,
          method: item.method,
          fromBank: item.bank || "N/A",
          fromAccount: item.card ? `**** **** **** ${item.card.last4}` : "N/A",
          toBank: "N/A",
          toAccount: "N/A",
          date: new Date(item.created_at * 1000).toISOString().split("T")[0],
          reference: item.acquirer_data.auth_code || item.id,
        }));

        setTransactions(formattedTransactions);
      } catch (err) {
        setError("Error fetching transactions: " + err.message);
      }
    };

    fetchTransactions();
  }, [page]);

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setSelectedTransaction(null);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <>
      <SideBar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-200 pt-[14vh] px-4 sm:px-6 lg:px-8 flex flex-col">
        <motion.div
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0 animate-fade-in">
            Transactions
          </h1>
          <input
            type="text"
            name="search"
            placeholder="Search by username..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setError("");
            }}
            className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 px-5 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
          />
        </motion.div>

        {error && (
          <motion.p
            className="text-red-500 text-sm mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}

        <motion.div
          className="flex-1 overflow-x-auto bg-white rounded-xl shadow-2xl border border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-100 text-indigo-800 text-xs uppercase">
              <tr>
                <th className="py-4 px-6 text-left">Username</th>
                <th className="py-4 px-6 text-left">Email</th>
                <th className="py-4 px-6 text-left">Mobile No</th>
                <th className="py-4 px-6 text-left">Amount</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-left">Method</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    className="hover:bg-indigo-50 transition duration-200"
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    <td className="py-4 px-6">{transaction.username}</td>
                    <td className="py-4 px-6">{transaction.email}</td>
                    <td className="py-4 px-6">{transaction.mobile}</td>
                    <td className="py-4 px-6">{transaction.amount}</td>
                    <td className="py-4 px-6 capitalize">
                      {transaction.status}
                    </td>
                    <td className="py-4 px-6 capitalize">
                      {transaction.method}
                    </td>
                    <td className="py-4 px-3 text-center">
                      <motion.button
                        onClick={() => openModal(transaction)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Details
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="py-6 px-6 text-center text-gray-500"
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>

        <div className="mt-4 flex justify-between items-center">
          <motion.button
            onClick={handlePrevPage}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg ${
              page === 1 ? "bg-gray-300" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white font-semibold`}
            whileHover={page === 1 ? {} : { scale: 1.05 }}
            whileTap={page === 1 ? {} : { scale: 0.95 }}
          >
            Previous
          </motion.button>
          <span className="text-gray-700">
            Page {page} of {totalPages}
          </span>
          <motion.button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg ${
              page === totalPages
                ? "bg-gray-300"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white font-semibold`}
            whileHover={page === totalPages ? {} : { scale: 1.05 }}
            whileTap={page === totalPages ? {} : { scale: 0.95 }}
          >
            Next
          </motion.button>
        </div>

        <AnimatePresence>
          {isOpen && selectedTransaction && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto mx-4 sm:mx-6 lg:mx-8"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 animate-fade-in">
                    Transaction Details
                  </h2>
                  <motion.button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-red-600 text-2xl font-bold focus:outline-none"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                </div>

                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <motion.div
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      custom={0}
                    >
                      <label
                        htmlFor="fromBank"
                        className="block text-sm font-medium text-gray-700"
                      >
                        From Bank
                      </label>
                      <input
                        type="text"
                        name="fromBank"
                        value={selectedTransaction.fromBank}
                        readOnly
                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                      />
                    </motion.div>
                    <motion.div
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      custom={1}
                    >
                      <label
                        htmlFor="fromAccount"
                        className="block text-sm font-medium text-gray-700"
                      >
                        From Account/Card Number
                      </label>
                      <input
                        type="text"
                        name="fromAccount"
                        value={selectedTransaction.fromAccount}
                        readOnly
                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                      />
                    </motion.div>
                    <motion.div
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      custom={2}
                    >
                      <label
                        htmlFor="toBank"
                        className="block text-sm font-medium text-gray-700"
                      >
                        To Bank
                      </label>
                      <input
                        type="text"
                        name="toBank"
                        value={selectedTransaction.toBank}
                        readOnly
                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                      />
                    </motion.div>
                    <motion.div
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      custom={3}
                    >
                      <label
                        htmlFor="toAccount"
                        className="block text-sm font-medium text-gray-700"
                      >
                        To Account Number
                      </label>
                      <input
                        type="text"
                        name="toAccount"
                        value={selectedTransaction.toAccount}
                        readOnly
                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                      />
                    </motion.div>
                    <motion.div
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      custom={4}
                    >
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Amount
                      </label>
                      <input
                        type="text"
                        name="amount"
                        value={selectedTransaction.amount}
                        readOnly
                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                      />
                    </motion.div>
                    <motion.div
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      custom={5}
                    >
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Status
                      </label>
                      <input
                        type="text"
                        name="status"
                        value={selectedTransaction.status}
                        readOnly
                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                      />
                    </motion.div>
                    <motion.div
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      custom={6}
                    >
                      <label
                        htmlFor="method"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Payment Method
                      </label>
                      <input
                        type="text"
                        name="method"
                        value={selectedTransaction.method}
                        readOnly
                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                      />
                    </motion.div>
                    <motion.div
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      custom={7}
                    >
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Transaction Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={selectedTransaction.date}
                        readOnly
                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                      />
                    </motion.div>
                    <motion.div
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      custom={8}
                    >
                      <label
                        htmlFor="reference"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Reference/Transaction ID
                      </label>
                      <input
                        type="text"
                        name="reference"
                        value={selectedTransaction.reference}
                        readOnly
                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    className="flex justify-end mt-8"
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    custom={9}
                  >
                    <motion.button
                      onClick={closeModal}
                      className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Close
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <style jsx>{`
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Transactions;
