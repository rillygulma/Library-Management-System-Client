import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SingleBook = () => {
  const { id } = useParams();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

        const url = `http://localhost:5000/api/users/singlebook/${id}`;
        const response = await axios.get(url, { headers });
        setBookData(response.data.data);
        localStorage.setItem("bookStatus", response.data.data.status);
        console.log(response.data.data.status);
      } catch (error) {
        setError(error.message);
        // You could display the error to the user or handle it more gracefully
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      setBookData(null);
      setLoading(true);
      setError(null);
    };
  }, [id]); // Dependency on id prop

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const { bookImageUrl, bookTitle, category, bookDescription, status, } = bookData || {};

  return (
    <div className="mt-28 px-4 lg:px-24 font-custom">
      {bookImageUrl && <img src={bookImageUrl} alt="Book Cover" />}
      {bookTitle && <h2 className="text-base font-bold">{bookTitle}</h2>}
      {category && <p className="font-semibold italic">{category}</p>}
      {bookDescription && <p>{bookDescription}</p>}
      {status && <button className="text-base bg-green-500 rounded-sm mt-2 font-bold">{status}</button>}
    </div>
  );
};

export default SingleBook;
