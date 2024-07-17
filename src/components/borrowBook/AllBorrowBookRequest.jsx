import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AllBorrowBookRequest = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem('user_id') || '');

  useEffect(() => {
    const handleStorageChange = () => {
      setUserId(localStorage.getItem('user_id'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    fetchBorrowers();
  }, [userId]);

  const fetchBorrowers = async () => {
    try {
      const accessToken = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/return-requests', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("Borrowed book response", response.data);
      const allBorrowers = response.data.flatMap((user) =>
        user.cart.map((book) => ({
          userId: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNo: user.phoneNo,
          role: user.role,
          bookTitle: book.bookTitle,
          borrowedBookId: book.borrowedBookId._id,
          checkoutForm: book.checkoutForm,
          status: book.status,
          department: user.department,
          staffNo: user.staffNo,
        }))
      );

      setBorrowers(allBorrowers);
    } catch (error) {
      console.error('Error fetching borrowers:', error);
      toast.error('Failed to fetch borrowers');
    }
  };

  const updateStatus = async (userId, bookId, status) => {
    try {
      const accessToken = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/accept-borrow-request/${userId}/${bookId}`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      fetchBorrowers();
      toast.success("Status updated successfully");
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Failed to update status");
    }
  };

  const sendMessage = async (borrowerId, messageContent) => {
    try {
      const accessToken = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/messages/send`,
        { borrowerId, message: messageContent },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success("Message sent successfully");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    }
  };

  const handleStatusChange = (borrower, status) => {
    updateStatus(borrower.userId, borrower.borrowedBookId, status);
  };

  const handleSendMessageClick = (borrower) => {
    const userMessage = prompt("Enter your message:");
    if (userMessage) {
      sendMessage(borrower.userId, userMessage);
    }
  };

  const filteredBorrowers = borrowers.filter((borrower) => borrower.status !== 'returned');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold text-white text-center bg-slate-600 mb-4 uppercase">Borrowers Requests</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-blue-300 font-MyFont border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Phone No</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Book Title</th>
              <th className="py-2 px-4 border-b">Return Date</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Action</th>
              <th className="py-2 px-4 border-b">Message</th>
            </tr>
          </thead>
          <tbody>
            {filteredBorrowers.map((borrower, index) => (
              <tr key={`${borrower.userId}-${borrower.borrowedBookId}`}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{borrower.fullName}</td>
                <td className="py-2 px-4 border-b">{borrower.email}</td>
                <td className="py-2 px-4 border-b">{borrower.phoneNo}</td>
                <td className="py-2 px-4 border-b uppercase">{borrower.role}</td>
                <td className="py-2 px-4 border-b">{borrower.bookTitle}</td>
                <td className="py-2 px-4 border-b">{borrower.checkoutForm.returnDate.slice(0, 10)}</td>
                <td className={`py-2 px-4 border-b ${borrower.status === 'accepted' ? 'bg-green-500' : ''}`}>
                  {borrower.status === 'processing' && <span className="bg-slate-500 text-white px-2 py-1 rounded">You have 0 Days Left</span>}
                  {borrower.status === 'pending' && <span className="bg-yellow-500 text-white px-2 py-1 rounded">Yet to be Accepted</span>}
                  {borrower.status !== 'processing' && borrower.status !== 'pending' && borrower.status}
                </td>
                <td className="py-2 px-4 border-b">
                  <select
                    onChange={(e) => handleStatusChange(borrower, e.target.value)}
                    value={borrower.status}
                    className={`px-4 py-2 rounded ${borrower.status === 'processing' || borrower.status === 'accepted' ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500'}`}
                    disabled={borrower.status === 'processing' || borrower.status === 'accepted'}
                  >
                    <option value="">Select Action</option>
                    <option value="accepted" disabled={borrower.status === 'accepted'}>Accept</option>
                    <option value="rejected">Reject</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleSendMessageClick(borrower)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllBorrowBookRequest;
