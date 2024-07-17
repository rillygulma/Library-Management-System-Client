import { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { FaShoppingCart } from 'react-icons/fa';
import { Card } from 'flowbite-react';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';

const SerialSearch = () => {
  const [formData, setFormData] = useState({ isbn: "", authorName: "", bookTitle: "", bookBarcode:"", publisher: "" });
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState({ borrowDate: new Date(), returnDate: new Date() });
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await axios.get('https://fubk-library-management-sytem-server.onrender.com/api/users/serialsearch', {
        params: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const { data } = response;
      if (data.length > 0) {
        const filteredResults = data.filter(serial =>
          serial.bookTitle && serial.bookTitle.toLowerCase().includes(formData.bookTitle.toLowerCase())
        );
        setSearchResults(filteredResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

      await axios.put(`https://fubk-library-management-sytem-server.onrender.com/api/admin/updatebook/${book._id}`, { status: 'pending' }, {
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
      await axios.put(`https://fubk-library-management-sytem-server.onrender.com/api/admin/updatebook/${bookId}`, { status: 'available' }, {
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

      const response = await axios.post('https://fubk-library-management-sytem-server.onrender.com/api/users/borrowers', dataToSave, {
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
      const response = await axios.get(`https://fubk-library-management-sytem-server.onrender.com/api/users/borrowersHistory/${userId}`, {
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
    <div className="max-w-md mx-auto">
      <h1 className='text-2xl bg-slate-700 text-blue-300 rounded-sm font-MyFont font-bold mt-5 mb-5'>Serials Search</h1>
      <form onSubmit={handleSubmitSearch} className="bg-blue-300 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className='font-bold  text-blue-600 mb-5'>Fill in the information to Search</h3>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="isbn">
            ISBN
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="isbn"
            name="isbn"
            type="text"
            placeholder="ISBN NUMBER"
            value={formData.isbn}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="authorName">
            Author Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="authorName"
            name="authorName"
            type="text"
            placeholder="Author Name"
            value={formData.authorName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bookTitle">
            Book Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="bookTitle"
            name="bookTitle"
            type="text"
            placeholder="Book Title"
            value={formData.bookTitle}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bookBarcode">
            Book Barcode
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="bookBarcode"
            name="bookBarcode"
            type="text"
            placeholder="Book Barcode"
            value={formData.bookBarcode}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publisher">
            Publisher
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="publisher"
            name="publisher"
            type="text"
            placeholder="Publisher"
            value={formData.publisher}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {isLoading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </form>

      <div className="cart-icon fixed top-16 right-6 cursor-pointer flex items-center" onClick={toggleCart}>
        <FaShoppingCart className="text-blue-600 text-2xl" />
        <span className="cart-count bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-1">{cart.length}</span>
      </div>

      {cartOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full relative">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={closeCart}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold mb-4">Books in Cart:</h3>
            <ul>
              {cart.map((item, index) => (
                <li key={item.book._id} className="mb-2">
                  <div className="flex justify-between items-center">
                    <span>{index + 1}. {item.book.bookTitle}</span>
                    <p className="mr-4">{item.book.authorName}</p>
                    <button className="text-red-500" onClick={() => removeItemFromCart(item.book._id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Borrow Date:</label>
                <DatePicker
                  selected={checkout.borrowDate}
                  onChange={(date) => setCheckout({ ...checkout, borrowDate: date })}
                  selectsStart
                  startDate={checkout.borrowDate}
                  endDate={checkout.returnDate}
                  dateFormat="yyyy-MM-dd"
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Return Date:</label>
                <DatePicker
                  selected={checkout.returnDate}
                  onChange={(date) => setCheckout({ ...checkout, returnDate: date })}
                  selectsEnd
                  startDate={checkout.borrowDate}
                  endDate={calculateMaxReturnDate(checkout.borrowDate, localStorage.getItem('role'))}
                  minDate={checkout.borrowDate}
                  maxDate={calculateMaxReturnDate(checkout.borrowDate, localStorage.getItem('role'))}
                  dateFormat="yyyy-MM-dd"
                  className="w-full border p-2 rounded"
                />
              </div>
              <button type="submit" className="block w-full mt-4 text-center bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Checkout</button>
            </form>
          </div>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="search-result grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((book) => (
            <div className="result-item" key={book._id}>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default SerialSearch;
