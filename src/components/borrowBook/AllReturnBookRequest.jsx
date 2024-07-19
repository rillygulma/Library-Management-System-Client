import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ReturnedBooks = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const accessToken = localStorage.getItem('token');
            const response = await axios.get('https://library-management-system-server-f0vl.onrender.com/api/admin/return-requests', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const allReturns = response.data.map(user =>
                user.cart.map(book => ({
                    ...book,
                    borrower: {
                        _id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        role: user.role,
                        staffNo: user.staffNo,
                        department: user.department,
                        phoneNo: user.phoneNo,
                    },
                    borrowedBookId: book.borrowedBookId._id,
                    returnDate: new Date(book.checkoutForm.returnDate).toLocaleDateString(),
                }))
            ).flat();

            setHistory(allReturns);
        } catch (error) {
            console.error('Error fetching returned books:', error);
            toast.error('Failed to fetch returned books');
        }
    };

    const handleAcceptReturn = async (userId, bookId) => {
        setLoading(true); // Set loading to true when starting the operation
        try {
            const accessToken = localStorage.getItem('token');
            console.log(`Accepting return for User ID: ${userId}, Book ID: ${bookId}`);

            // Accept return endpoint
            await axios.put(
                `https://library-management-system-server-f0vl.onrender.com/api/admin/accept-borrow-request/${userId}/${bookId}`,
                { status: 'returned' },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Update book status endpoint
            await axios.put(
                `https://library-management-system-server-f0vl.onrender.com/api/admin/updatebook/${bookId}`,
                { status: 'available' },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            toast.success('Return accepted successfully');

            // Update history state by removing the accepted book
            setHistory(prevHistory => 
                prevHistory.filter(book => book.borrowedBookId !== bookId || book.borrower._id !== userId)
            );

        } catch (error) {
            console.error('Error accepting book return:', error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Failed to accept book return');
            }
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold text-white text-center bg-slate-600 mb-4 uppercase">Returned Books</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-blue-300 font-MyFont border border-gray-300">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">#</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">User ID</th>
                            <th className="py-2 px-4 border-b">Book ID</th>
                            <th className="py-2 px-4 border-b">Book Title</th>
                            <th className="py-2 px-4 border-b">Role</th>
                            <th className="py-2 px-4 border-b">Return Date</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((book, index) => (
                            <tr key={`${book.borrowedBookId}-${index}`}>
                                <td className="py-2 px-4 border-b">{index + 1}</td>
                                <td className="py-2 px-4 border-b">{book.borrower.email}</td>
                                <td className="py-2 px-4 border-b">{book.borrower._id}</td>
                                <td className="py-2 px-4 border-b">{book.borrowedBookId}</td>
                                <td className="py-2 px-4 border-b">{book.bookTitle}</td>
                                <td className="py-2 px-4 border-b uppercase">{book.borrower.role}</td>
                                <td className="py-2 px-4 border-b">{book.returnDate}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleAcceptReturn(book.borrower._id, book.borrowedBookId)}
                                        className={`bg-green-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={loading} // Disable button while loading
                                    >
                                        {loading ? 'Processing...' : 'Accept Return'}
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

export default ReturnedBooks;
