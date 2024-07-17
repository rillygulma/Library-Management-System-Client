import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast';

const ManageBooks = () => {
    const navigate = useNavigate();

  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem('token');
      if (!accessToken) {
        throw new Error('User not logged in. Please log in to view this page.');
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };

      const url = 'https://fubk-library-management-sytem-server.onrender.com/api/users/allbooks';
      const response = await axios.get(url, { headers });
      localStorage.setItem("bookStatus", response.data.data.status);
      setBooks(response.data.data);
      console.log(response.data.data[0].status);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleEdit = (bookId) => {
    navigate(`/admin/editbook/${bookId}`);
    console.log('Editing book with ID:', bookId);
  };

  const handleDelete = async (bookId) => {
    try {
      const accessToken = localStorage.getItem('token');
      await axios.delete(`https://fubk-library-management-sytem-server.onrender.com/api/admin/deletebook/${bookId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Book deleted successfully');
      setBooks(books.filter(book => book._id !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Error deleting book:', error);
    }
  };

  return (
    <div className="mt-28 px-4 bg-blue-300 lg:px-24 font-custom">
      {books.map((book) => (
        <div key={book._id}>
            <h1 className='text-3xl sm:text-4xl md:text-5xl bg-slate-600 uppercase font-bold text-center text-white mt-8 mb-10'>Edit Or Delete Book</h1>
          <img src={book.bookImageUrl} alt="Book Cover" />
          <h2 className="text-base font-bold">{book.bookTitle}</h2>
          <p className="font-semibold italic">{book.category}</p>
          <p>{book.bookDescription}</p>
          <button className="font-medium text-white bg-green-600 hover:bg-green-700 hover:underline px-4 py-2 mt-5 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition ease-in-out duration-300 mr-5" onClick={() => handleEdit(book._id)}>Edit</button>
          <button className="ml-2 text-white bg-red-600 hover:bg-red-700 px-4 py-2 mt-5 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition ease-in-out duration-300" onClick={() => handleDelete(book._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ManageBooks;
