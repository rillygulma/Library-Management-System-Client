import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const BookRenewal = () => {
  const [borrowerId, setBorrowerId] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [newReturnDate, setNewReturnDate] = useState('');
  const [message, setMessage] = useState('');

  const handleRenewal = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('token');
      const response = await axios.put(
        `https://library-management-system-server-f0vl.onrender.com/api/update-return-date`,
        {
          borrowerId,
          bookTitle,
          newReturnDate
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      if (response.status === 200) {
        setMessage('Book renewal successful!');
      }
      toast.success("Book renewal successful!");
    } catch (error) {
      console.error('There was an error renewing the book!', error);
      setMessage('Failed to renew the book.');
    }
  };
  
  return (
    <div className="p-6 max-w-sm mt-10 mx-auto bg-blue-300 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Renew Book</h2>
      <form onSubmit={handleRenewal}>
        <div className="mb-4">
          <label htmlFor="borrowerId" className="block text-gray-700 mb-2">Borrower ID:</label>
          <input
            type="text"
            id="borrowerId"
            value={borrowerId}
            onChange={(e) => setBorrowerId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="bookTitle" className="block text-gray-700 mb-2">Book Title:</label>
          <input
            type="text"
            id="bookTitle"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="newReturnDate" className="block text-gray-700 mb-2">New Return Date:</label>
          <input
            type="date"
            id="newReturnDate"
            value={newReturnDate}
            onChange={(e) => setNewReturnDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200">Renew Book</button>
      </form>
      {message && <p className={`mt-4 text-${message === 'Book renewal successful!' ? 'green' : 'red'}-600`}>{message}</p>}
    </div>
  );
};

export default BookRenewal;
