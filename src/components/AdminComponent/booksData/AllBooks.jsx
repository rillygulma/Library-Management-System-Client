import { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState({
    borrowDate: new Date(),
    returnDate: new Date(),
  });
  const [userRole, setUserRole] = useState('');

  const getUserDetailsFromLocalStorage = () => {
    return {
      userId: localStorage.getItem('user_id'),
      fullName: localStorage.getItem('fullName'),
      email: localStorage.getItem('email'),
      phoneNo: localStorage.getItem('phoneNo'),
      role: localStorage.getItem('role'),
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        if (!accessToken) {
          throw new Error('User not logged in. Please log in to view this page.');
        }
        const response = await axios.get('https://fubk-library-management-sytem-server.onrender.com/api/users/allbooks', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const bookStatus = response.data.data.filter(book => book.status === 'borrowed');
        const bookStatusJSON = JSON.stringify(bookStatus);
        localStorage.setItem('bookStatus', bookStatusJSON);

        setBooks(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(error.response?.data?.message || 'User not logged in. Please log in to view these books.');
      }
    };

    const userDetails = getUserDetailsFromLocalStorage();
    setUserRole(userDetails.role);

    fetchData();
  }, []);

  const handleTyping = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const checkIfUserHasBorrowed = async (userId) => {
    try {
      const accessToken = localStorage.getItem('token');
      const response = await axios.get(`https://fubk-library-management-sytem-server.onrender.com/api/users/${userId}/check-eligibility`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data.isBorrowed === true;
      
    } catch (error) {
      console.error('Error checking if user has borrowed:', error.response?.data?.message || error.message);
      return false;
    }
  };

  const addToCart = async (book) => {
    try {
      const accessToken = localStorage.getItem('token');
      const userDetails = getUserDetailsFromLocalStorage();
      const { userId, role } = userDetails;

      const hasAlreadyBorrowed = await checkIfUserHasBorrowed(userId);
      if (hasAlreadyBorrowed) {
        toast.error('You have already borrowed a book. Please return the book before borrowing another one.');
        return;
      }

      const maxItems = role === 'staff' ? 5 : 3;
      if (cart.length >= maxItems) {
        toast.error(`You can only add ${maxItems} books to your cart.`);
        return;
      }

      if (cart.some(item => item.book._id === book._id)) {
        toast.error('This book is already in your cart.');
        return;
      }

      const bookStatusJSON = localStorage.getItem('bookStatus');
      const bookStatus = JSON.parse(bookStatusJSON);
      const isBookBorrowed = bookStatus.some(item => item._id === book._id && item.status === 'borrowed');
      if (isBookBorrowed) {
        toast.error('This book has already been borrowed.');
        return;
      }

      await axios.put(`https://fubk-library-management-sytem-server.onrender.com/api/admin/updatebook/${book._id}`, { status: 'pending' }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      setCart(prevCart => [...prevCart, { book, userDetails }]);
      setBooks(prevBooks => prevBooks.map(b => b._id === book._id ? { ...b, status: 'pending' } : b));
    } catch (error) {
      console.error('Error updating book status:', error.response?.data?.message || error.message);
      toast.error('Error updating book status. Please try again.');
    }
  };

  const removeItemFromCart = async (bookId) => {
    try {
      const accessToken = localStorage.getItem('token');
      await axios.put(`https://fubk-library-management-sytem-server.onrender.com/api/admin/updatebook/${bookId}`, { status: 'available' }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      setCart((prevCart) => prevCart.filter((item) => item.book._id !== bookId));
      setBooks((prevBooks) => prevBooks.map(b => b._id === bookId ? { ...b, status: 'available' } : b));
    } catch (error) {
      console.error('Error updating book status:', error.response?.data?.message || error.message);
      toast.error('Error updating book status. Please try again.');
    }
  };

  const toggleCart = () => {
    setCartOpen((prevState) => !prevState);
  };

  const closeCart = () => {
    setCartOpen(false);
  };

  const calculateMaxReturnDate = (borrowDate, role) => {
    const maxReturnDate = new Date(borrowDate);
    maxReturnDate.setDate(maxReturnDate.getDate() + (role === 'staff' ? 10 : 5));
    return maxReturnDate;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const accessToken = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
    
      const hasAlreadyBorrowed = await checkIfUserHasBorrowed(userId);
      if (hasAlreadyBorrowed) {
        toast.error('You have already borrowed a book. Please return the book before borrowing another one.');
        return;
      }

      const cartItems = cart.map((item) => ({
        borrowedBookId: item.book._id,
        bookTitle: item.book.bookTitle,
        authorName: item.book.authorName,
        returnDate: calculateMaxReturnDate(checkout.borrowDate, item.userDetails.role).toISOString(),
      }));

      const response = await axios.post(`https://fubk-library-management-sytem-server.onrender.com/api/users/${userId}/borrow`, cartItems, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Data saved successfully:', response.data);
      toast.success('Your borrowing request has been submitted!');
      setCart([]);
      setCheckout({
        borrowDate: new Date(),
        returnDate: new Date(),
      });
      setCartOpen(false);
    } catch (error) {
      console.error('Error submitting data:', error.response?.data?.message || error.message);
      toast.error('Error submitting borrowing request. Please try again.');
    }
  };

  const filteredBooks = books.filter(book =>
    book.bookTitle.toLowerCase().includes(searchTerm) ||
    book.authorName.toLowerCase().includes(searchTerm) ||
    book.category.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="mt-28 px-4 lg:px-24 relative">
      <input
        id="search"
        type="text"
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        placeholder="Search your books here"
        value={searchTerm}
        onChange={handleTyping}
      />

      <h2 className="text-5xl sm:mt-10 mb-10 font-bold text-center">All Books are here</h2>

      <div className="cart-icon fixed top-16 right-6 cursor-pointer flex items-center" onClick={toggleCart}>
        <FaShoppingCart className="text-blue-600 text-2xl" />
        <span className="cart-count bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-1">{cart.length}</span>
      </div>

      {cartOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full relative">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={closeCart}>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl bg-blue-600 text-white font-bold mb-4 inline-block px-2 py-1">Books in Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul>
                {cart.map((item, index) => (
                  <li key={item.book._id} className="flex items-center justify-between mb-2">
                    <span>{index + 1}. {item.book.bookTitle}</span>
                    <button className="text-red-500 hover:text-red-700" onClick={() => removeItemFromCart(item.book._id)}>
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {cart.length > 0 && (
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                  <label htmlFor="borrowDate" className="block mb-2">Borrow Date</label>
                  <DatePicker
                    id="borrowDate"
                    selected={checkout.borrowDate}
                    onChange={(date) => setCheckout({ ...checkout, borrowDate: date, returnDate: calculateMaxReturnDate(date, userRole) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="returnDate" className="block mb-2">Return Date</label>
                  <DatePicker
                    id="returnDate"
                    selected={checkout.returnDate}
                    onChange={(date) => setCheckout({ ...checkout, returnDate: date })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    dateFormat="yyyy-MM-dd"
                    minDate={checkout.borrowDate}
                    maxDate={calculateMaxReturnDate(checkout.borrowDate, userRole)}
                  />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-300">
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBooks.map((book) => (
          <div key={book._id} className="max-w-sm mx-auto">
            <Card>
              <img
                src={book.bookImageUrl}
                alt={book.bookTitle}
                className="w-full lg:w-1/2 mx-auto"
              />
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-black">
                {book.bookTitle}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">{book.category}</p>
              <p className="font-normal text-black">{book.bookDescription}</p>
              <div className={`mb-2 rounded-md p-2 ${book.status === 'available' ? 'bg-green-100 border-green-500' : 'bg-yellow-100 border-yellow-500'}`}>
                <span className={`text-sm uppercase font-semibold ${book.status === 'available' ? 'text-green-700' : 'text-yellow-500'}`}>Status: {book.status}</span>
              </div>
              {book.status !== 'pending' && (
                <button
                  onClick={() => addToCart(book)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-300"
                >
                  Add to Cart
                </button>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBooks;
