import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const BookReturnRequest = () => {
  const [formData, setFormData] = useState({
    email: '',
    userId: '',
    bookId: '',
    bookTitle: '',
    role: '',
    returnDate: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch and set the current values from localStorage
    setFormData({
      email: localStorage.getItem('email') || '',
      userId: localStorage.getItem('user_id') || '',
      bookId: localStorage.getItem('bookId') || '',
      bookTitle: '',
      role: localStorage.getItem('role') || '',
      returnDate: ''
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update formData with the latest values from localStorage
    const updatedFormData = {
      ...formData,
      email: localStorage.getItem('email') || formData.email,
      userId: localStorage.getItem('user_id') || formData.userId,
      bookId: localStorage.getItem('bookId') || formData.bookId,
      role: localStorage.getItem('role') || formData.role,
    };

    const storedRole = localStorage.getItem('role');
    if (updatedFormData.role !== storedRole) {
      toast.error('Please select your correct role!');
      return; // Prevent form submission
    }

    try {
      const accessToken = localStorage.getItem('token');
      const response = await axios.post('https://library-management-system-server-f0vl.onrender.com/api/users/returnBookRequest', updatedFormData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      console.log('Successfully:', response.data);

      // Optionally, show a success message
      toast.success('Return Book request submitted successfully!');

      // Navigate to the borrow history page
      navigate('/user/borrowHistory/');
    } catch (error) {
      console.error('There was an error!', error);
      toast.error('An error occurred while submitting your request.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='bg-blue-300 max-w-md mx-auto mt-8 p-4 border rounded-lg shadow-md'>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-center mt-5 mb-10">Return Book Request</h1>
        <label className="block text-sm font-medium text-gray-700">Book Title:</label>
        <input
          type="text"
          name="bookTitle"
          placeholder='Paste Your Book Title Here.'
          value={formData.bookTitle}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Book ID:</label>
        <input
          type="text"
          name="bookId"
          value={formData.bookId}
          onChange={handleChange}
          required
          disabled
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">User ID:</label>
        <input
          type="text"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          required
          disabled
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Role:</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          disabled
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="staff">Staff</option>
          <option value="student">Student</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Return Date:</label>
        <input
          type="date"
          name="returnDate"
          value={formData.returnDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        Submit
      </button>
    </form>
  );
};

export default BookReturnRequest;
