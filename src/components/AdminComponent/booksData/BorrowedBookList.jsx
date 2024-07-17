import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const BorrowedBookList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/allborrowers', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        });

        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const accessToken = localStorage.getItem('token');
      const apiUrl = `http://localhost:5000/api/deleteborrowedUsers/${id}`;
      await axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      setData((prevData) => prevData.map(borrower => ({
        ...borrower,
        cart: borrower.cart.filter(cartItem => cartItem._id !== id)
      })).filter(borrower => borrower.cart.length > 0));

      toast.success('Book Successfully Returned');
    } catch (error) {
      console.error('Error deleting item:', error.message);

      if (error.response && error.response.status === 404) {
        toast.error('Item not found');
      } else {
        toast.error('Error deleting item');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <a href='/admin/dashboard' className="block w-full max-w-xs mx-auto bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-400 text-center">Go to Dashboard</a>
      <h2 className="text-2xl font-bold mb-4 mt-5 text-center">Borrowed Book List</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">No</th>
              <th className="py-2 px-4 border">Phone No</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Book Title</th>
              <th className="py-2 px-4 border">Author Name</th>
              <th className="py-2 px-4 border">Borrower Name</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Borrow Date</th>
              <th className="py-2 px-4 border">Return Date</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order, orderIndex) => (
              order.cart.map((item, itemIndex) => (
                <tr key={item._id}>
                  <td className="py-2 px-4 border">{orderIndex + 1}-{itemIndex + 1}</td>
                  <td className="py-2 px-4 border">{item.borrower.phoneNo}</td>
                  <td className="py-2 px-4 border">{item.borrower.email}</td>
                  <td className="py-2 px-4 border">{item.book.bookTitle}</td>
                  <td className="py-2 px-4 border">{item.book.authorName}</td>
                  <td className="py-2 px-4 border">{item.borrower.fullName}</td>
                  <td className="py-2 px-4 border">{item.borrower.role}</td>
                  <td className="py-2 px-4 border">{new Date(item.checkoutForm.borrowDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border">{new Date(item.checkoutForm.returnDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border">{item.status}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
                    >
                      Return Book
                    </button>
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowedBookList;
