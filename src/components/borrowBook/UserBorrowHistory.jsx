import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaTimes } from 'react-icons/fa';

const UserBorrowHistory = () => {
  const [cartData, setCartData] = useState([]);
  const [daysUntilReturn, setDaysUntilReturn] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [returnDate, setReturnDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [actionType, setActionType] = useState('');
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');
  const fullName = localStorage.getItem('fullName');
  const email = localStorage.getItem('email');
  const staffNo = localStorage.getItem('staffNo');

  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://fubk-library-management-sytem-server.onrender.com/api/users/${userId}/cartItems`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          if (response.data.length === 0) {
            toast.error('No records found for the user.');
          }
          setCartData(response.data);
        } else {
          console.error('Failed to fetch cart data');
        }
      } catch (error) {
        toast.error('Error fetching cart data.');
        console.error('Error fetching cart data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchCartData();
    }
  }, [userId, token]);

  useEffect(() => {
    const updateDaysUntilReturn = () => {
      const updatedData = cartData.map((item) => {
        const returnDate = new Date(item.checkoutForm.returnDate);
        const today = new Date();
        const diffInTime = returnDate.getTime() - today.getTime();
        const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
        return {
          ...item,
          daysUntilReturn: diffInDays,
        };
      });
      setDaysUntilReturn(updatedData);
    };

    updateDaysUntilReturn();
    const interval = setInterval(updateDaysUntilReturn, 86400000);

    return () => clearInterval(interval);
  }, [cartData]);

  const getDaysLeftText = (item) => {
    if (item.status === 'processing') {
      return 'You have 0 Days Left';
    } else if (item.status === 'pending') {
      return 'Yet to be Accepted';
    } else if (item.status === 'accepted' && item.renewalStatus !== 'requested') {
      return `${item.daysUntilReturn} DAYS LEFT`;
    }
    return '';
  };

  const getDaysLeftColor = (item) => {
    if (item.status === 'processing') {
      return 'text-red-500';
    } else if (item.status === 'pending') {
      return 'text-yellow-500';
    } else if (item.status === 'accepted' && item.renewalStatus !== 'requested') {
      return 'bg-green-600 text-white';
    }
    return 'text-green-600';
  };

  const handleReturnBook = async () => {
    if (!selectedBook) {
      toast.error('Please select a book.');
      return;
    }

    try {
      const response = await axios.post(
        `https://fubk-library-management-sytem-server.onrender.com/api/users/${userId}/returnBook/${selectedBook.borrowedBookId._id}`,
        {
          returnDate: returnDate.toISOString(),
          role,
          userId,
          fullName,
          email,
          staffNo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        toast.success('Book returned successfully!');
        navigate('/user/borrowHistory/');
      }
    } catch (error) {
      if (error.response?.data?.error === 'Book not found in cart') {
        toast.error('Book not found in your cart. Please refresh the page.');
      } else {
        toast.error('Error returning the book.');
        console.error('Error returning the book:', error);
      }
    }
  };

  const handleRenewBook = async () => {
    if (!selectedBook) {
      toast.error('Please select a book.');
      return;
    }

    try {
      const response = await axios.post(
        `https://fubk-library-management-sytem-server.onrender.com/api/users/${userId}/renewBook/${selectedBook.borrowedBookId._id}`,
        {
          returnDate: returnDate.toISOString(),
          role,
          fullName,
          email,
          staffNo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        toast.success('Book Renewal Request Sent successfully!');
        navigate('/user/borrowHistory/');
      }
    } catch (error) {
      if (error.response?.data?.error === 'Book not found in cart') {
        toast.error('Book not found in your cart. Please refresh the page.');
      } else {
        toast.error('Error renewing the book.');
        console.error('Error renewing the book:', error);
      }
    }
  };

  const openDatePicker = (book, action) => {
    setSelectedBook(book);
    setActionType(action);
    setShowDatePicker(true);
  };

  const handleDateChange = (date) => {
    setReturnDate(date);
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  const getMaxDate = () => {
    if (!selectedBook) return new Date();

    const returnDate = new Date(selectedBook.checkoutForm.returnDate);
    const maxRenewalDate = new Date(returnDate.getTime() + 5 * 24 * 60 * 60 * 1000);
    return maxRenewalDate;
  };

  const isButtonHidden = (status) => {
    return status === 'processing' || status === 'returned' || status === 'pending';
  };

  return (
    <div className="p-4">
      <h2 className="text-lg text-blue-500 text-center font-bold mb-2">User Books Borrow History:</h2>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate('/previousRecord')}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Check Previous Records
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
          <p className="ml-4 text-lg">Loading...</p>
        </div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 font-MyFont">
              <th className="py-2 px-4 border-b">Serial No</th>
              <th className="py-2 px-4 border-b">Book Title</th>
              <th className="py-2 px-4 border-b">Author Name</th>
              <th className="py-2 px-4 border-b">Borrow Date</th>
              <th className="py-2 px-4 border-b">Return Date</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Renewal Status</th>
              <th className="py-2 px-4 border-b">Days Until Return</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {daysUntilReturn.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                <td className="py-2 px-4 border-b">{item.bookTitle}</td>
                <td className="py-2 px-4 border-b">{item.authorName}</td>
                <td className="py-2 px-4 border-b">{new Date(item.checkoutForm.borrowDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{new Date(item.checkoutForm.returnDate).toLocaleDateString()}</td>
                <td className={`py-2 px-4 border-b text-center font-semibold ${getDaysLeftColor(item)}`}>
                  {item.status.toUpperCase()}
                </td>
                <td className={`py-2 px-4 border-b text-center font-semibold ${getDaysLeftColor(item)}`}>
                  {item.renewalStatus}
                </td>
                <td className={`py-2 px-4 border-b text-center font-semibold ${getDaysLeftColor(item)}`}>
                  {getDaysLeftText(item)}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {!isButtonHidden(item.status) && (
                    <>
                      <button
                        onClick={() => openDatePicker(item, 'return')}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 mr-2"
                      >
                        Return Book
                      </button>
                      {item.renewalStatus !== 'renewed' && (
                        <button
                          onClick={() => openDatePicker(item, 'renew')}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                          Renew Book
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showDatePicker && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{`Select ${actionType === 'renew' ? 'Renewal' : 'Return'} Date`}</h3>
              <button onClick={closeDatePicker} className="text-red-500 hover:text-red-700">
                <FaTimes />
              </button>
            </div>
            <DatePicker
              selected={returnDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
              maxDate={getMaxDate()}
              inline
            />
            <div className="flex justify-end mt-4">
              {actionType === 'renew' ? (
                <button
                  onClick={handleRenewBook}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Renew Book
                </button>
              ) : (
                <button
                  onClick={handleReturnBook}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
                >
                  Return Book
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBorrowHistory;
