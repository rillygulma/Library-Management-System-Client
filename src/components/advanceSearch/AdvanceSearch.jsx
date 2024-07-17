import { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { FaShoppingCart } from 'react-icons/fa';
import { Card } from 'flowbite-react';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';

const AdvanceSearch = () => {
  const [formData, setFormData] = useState({ searchBy: "", value: "" });
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState({ borrowDate: new Date(), returnDate: new Date() });
  const [isLoading, setIsLoading] = useState(false);
  const [backendError, setBackendError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    try {
      const accessToken = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/serialsearch', {
        params: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const { data } = response;
      console.log(response.data);
      if (data.length > 0) {
        const filteredResults = data.filter(serial => 
          serial[formData.searchBy] && serial[formData.searchBy].toLowerCase().includes(formData.value.toLowerCase())
        );
        setSearchResults(filteredResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setBackendError('Error searching for books.');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (book) => {
    try {
      const accessToken = localStorage.getItem('token');
      const borrower = {
        userId: localStorage.getItem('user_id'),
        fullName: localStorage.getItem('fullName'),
        email: localStorage.getItem('email'),
        phoneNo: localStorage.getItem('phoneNo'),
        role: localStorage.getItem('role'),
      };

      const maxItems = borrower.role === 'staff' ? 5 : 3;
      if (cart.length >= maxItems) {
        toast.error(`You can only add ${maxItems} books to your cart.`);
        return;
      }

      if (cart.some((item) => item.book._id === book._id)) {
        toast.error('This book is already in your cart.');
        return;
      }

      const bookStatusJSON = localStorage.getItem('bookStatus');
      const bookStatus = JSON.parse(bookStatusJSON);
      const isBookBorrowed = bookStatus.some((item) => item._id === book._id && item.status === 'borrowed');
      if (isBookBorrowed) {
        toast.error('This book has already been borrowed.');
        return;
      }

      await axios.put(`http://localhost:5000/api/admin/updatebook/${book._id}`, { status: 'pending' }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      setCart((prevCart) => [...prevCart, { book, borrower }]);
      setSearchResults((prevResults) => prevResults.map((b) => (b._id === book._id ? { ...b, status: 'pending' } : b)));
    } catch (error) {
      console.error('Error updating book status:', error.response?.data?.message || error.message);
      toast.error('Error updating book status. Please try again.');
    }
  };

  const removeItemFromCart = async (bookId) => {
    try {
      const accessToken = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/updatebook/${bookId}`, { status: 'available' }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      setCart((prevCart) => prevCart.filter((item) => item.book._id !== bookId));
      setSearchResults((prevResults) => prevResults.map((b) => (b._id === bookId ? { ...b, status: 'available' } : b)));
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
    maxReturnDate.setDate(maxReturnDate.getDate() + (role === 'staff' ? 10 : 7));
    return maxReturnDate;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const accessToken = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');

      const hasAlreadyBorrowed = await checkIfUserHasBorrowed(userId);
      if (hasAlreadyBorrowed) {
        toast.error('You have already borrowed a book. Please return the book before borrowing another one');
        return;
      }

      const dataToSave = {
        cart: cart.map((item) => ({
          ...item,
          checkoutForm: {
            ...checkout,
            returnDate: calculateMaxReturnDate(checkout.borrowDate, item.borrower.role),
          },
        })),
        userId,
      };

      const response = await axios.post('http://localhost:5000/api/users/borrowers', dataToSave, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
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

  const checkIfUserHasBorrowed = async (userId) => {
    try {
      const accessToken = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/users/borrowersHistory/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.length > 0;
    } catch (error) {
      console.error('Error checking if user has borrowed:', error.response?.data?.message || error.message);
      return false;
    }
  };

  return (
    <div className="mt-28 bg-blue-300 px-4 lg:px-24 relative">
      {backendError && <div className="text-red-500 font-bold mb-5">{backendError}</div>}
      <h2 className="text-5xl sm:mt-10 bg-slate-700 text-blue-300 rounded-sm font-MyFont font-bold text-center">Advance Search Section</h2>
      <form onSubmit={handleSubmitSearch} className="search-options mt-5 flex flex-col sm:flex-row items-center">
  <select 
    name="searchBy" 
    value={formData.searchBy} 
    onChange={handleChange} 
    className="p-2 mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto border border-gray-300 rounded">
    <option value="">Search By</option>
    <option value="bookTitle">Book Title</option>
    <option value="bookBarcode">Book Barcode</option>
    <option value="placeOfPub">Place Of Pub</option>
    <option value="yearPublished">Year Published</option>
  </select>
  <input
    type="text"
    name="value"
    value={formData.value}
    onChange={handleChange}
    className="p-2 mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto border border-gray-300 rounded"
    placeholder="Enter search value"
  />
  <button 
    type="submit"
    className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full sm:w-auto hover:bg-blue-700 transition duration-300">
    {isLoading ? 'Loading...' : 'Search'}
  </button>
</form>
      <div className="cart-icon fixed top-16 right-6 cursor-pointer flex items-center" onClick={toggleCart}>
        <FaShoppingCart className="text-blue-600 text-2xl" />
        <span className="cart-count bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-1">{cart.length}</span>
      </div>

      {cartOpen && (
        <div className="cart bg-white p-6 rounded-lg shadow-lg fixed top-24 right-4 z-50 w-full sm:w-auto">
          <h3 className="text-xl font-bold mb-4">Cart</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item, index) => (
                <div key={index} className="mb-4">
                  <p>{item.book.bookTitle}</p>
                  <button
                    onClick={() => removeItemFromCart(item.book._id)}
                    className="bg-red-500 text-white font-bold py-1 px-2 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="mt-4">
                <form onSubmit={handleSubmit} className="flex flex-col">
                  <label className="mb-2">
                    Borrow Date:
                    <DatePicker
                      selected={checkout.borrowDate}
                      onChange={(date) => setCheckout((prevState) => ({ ...prevState, borrowDate: date }))}
                      className="p-2 border rounded"
                    />
                  </label>
                  <label className="mb-4">
                    Return Date:
                    <DatePicker
                      selected={checkout.returnDate}
                      onChange={(date) => setCheckout((prevState) => ({ ...prevState, returnDate: date }))}
                      className="p-2 border rounded"
                    />
                  </label>
                  <button
                    type="submit"
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
                  >
                    Checkout
                  </button>
                </form>
              </div>
            </>
          )}
          <button
            className="mt-4 bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-700"
            onClick={closeCart}
          >
            Close
          </button>
        </div>
      )}

      <div className="search-result grid grid-cols-1 mt-10 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResults.length > 0 ? (
          searchResults.map((book, index) => (
            <div key={index} className="book-card bg-white p-4 rounded-lg shadow-lg">
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

                {book.status === 'available' && (
                  <div>
                    <button className="text-base rounded-sm mr-5 mt-2 font-bold uppercase bg-green-500">
                      Available
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold mr-10 py-2 px-4 rounded" onClick={() => addToCart(book)}>
                      GET IT
                    </button>
                  </div>
                )}

                {book.status === 'borrowed' && (
                  <button className="text-base rounded-sm mt-2 font-bold uppercase bg-green-500">
                    BORROWED
                  </button>
                )}

                {book.status === 'pending' && (
                  <button className="text-base rounded-sm mt-2 font-bold uppercase bg-yellow-500">
                    PENDING
                  </button>
                )}
              </Card>
            </div>
          ))
        ) : (
          <p className="text-center mt-5">No books found.</p>
        )}
      </div>
    </div>
  );
};

export default AdvanceSearch;
