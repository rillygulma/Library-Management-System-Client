import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ALLBookRenewalRequest = () => {
    const [history, setHistory] = useState([]);
    const [newReturnDate, setNewReturnDate] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const accessToken = localStorage.getItem('token');
            const response = await axios.get('https://library-management-system-server-f0vl.onrender.com/api/admin/renewal-requests', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Renewal Request", response.data);
            const allReturns = response.data.flatMap(user =>
                user.cart.map(book => ({
                    ...book,
                    borrower: {
                        _id: user.userId,
                        email: user.email,
                        role: user.role,
                    },
                    borrowedBookId: book.borrowedBookId,
                    returnDate: new Date(book.checkoutForm.returnDate).toLocaleDateString(),
                    bookTitle: book.bookTitle,
                    authorName: book.authorName
                }))
            );

            setHistory(allReturns);
        } catch (error) {
            console.error('Error fetching renewal requests:', error);
            toast.error('Failed to fetch renewal requests');
        }
    };

    const handleActionChange = async (event, userId, bookId) => {
        const action = event.target.value;

        if (action === 'accept') {
            await handleAcceptRenewal(userId, bookId);
        } else if (action === 'reject') {
            await handleRejectRenewal(userId, bookId);
        }
    };

    const handleAcceptRenewal = async (userId, bookId) => {
        try {
            const accessToken = localStorage.getItem('token');
            const response = await axios.post(
                `https://library-management-system-server-f0vl.onrender.com/api/renewals/update-renewal-status`,
                { userId, bookId, newReturnDate },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            toast.success(response.data.message || 'Renewal Request Accepted Successfully');
            setHistory(prevHistory => prevHistory.filter(book => !(book.borrower._id === userId && book.borrowedBookId === bookId)));
        } catch (error) {
            console.error('Error accepting book renewal:', error);
            toast.error(error.response?.data?.message || 'Failed to accept book renewal');
        }
    };

    const handleRejectRenewal = async (userId, bookId) => {
        try {
            const accessToken = localStorage.getItem('token');
            await axios.put(
                `https://library-management-system-server-f0vl.onrender.com/api/admin/reject-borrow-request/${userId}/${bookId}`,
                { status: 'rejected' },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            toast.success('Renewal Request Rejected Successfully');
            setHistory(prevHistory => prevHistory.filter(book => !(book.borrower._id === userId && book.borrowedBookId === bookId)));
        } catch (error) {
            console.error('Error rejecting book renewal:', error);
            toast.error(error.response?.data?.message || 'Failed to reject book renewal');
        }
    };

    return (
        <div className="mx-auto p-4">
            <h1 className="text-2xl font-bold text-white text-center bg-slate-600 mb-4 py-2 rounded-md shadow-md uppercase">Renewal Books Request</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-blue-300 border border-gray-300 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-blue-400 text-white">
                            <th className="py-2 px-4 border-b">No</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">User ID</th>
                            <th className="py-2 px-4 border-b">Book ID</th>
                            <th className="py-2 px-4 border-b">Book Title</th>
                            <th className="py-2 px-4 border-b">Author Name</th>
                            <th className="py-2 px-4 border-b">Return Date</th>
                            <th className="py-2 px-4 border-b">New Return Date</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((book, index) => (
                            <tr key={`${book.borrowedBookId}-${index}`} className="hover:bg-blue-100">
                                <td className="py-2 px-4 border-b">{index + 1}</td>
                                <td className="py-2 px-4 border-b">{book.borrower.email}</td>
                                <td className="py-2 px-4 border-b">{book.borrower._id}</td>
                                <td className="py-2 px-4 border-b">{book.borrowedBookId}</td>
                                <td className="py-2 px-4 border-b">{book.bookTitle}</td>
                                <td className="py-2 px-4 border-b">{book.authorName}</td>
                                <td className="py-2 px-4 border-b">{book.returnDate}</td>
                                <td className="py-2 px-4 border-b">
                                    <input
                                        type="date"
                                        value={newReturnDate}
                                        onChange={(e) => setNewReturnDate(e.target.value)}
                                        className="bg-white text-black px-2 py-1 rounded border border-gray-300"
                                    />
                                </td>
                                <td className="py-2 mt-2 px-4 border-b flex space-x-2">
                                    <select
                                        onChange={(event) => handleActionChange(event, book.borrower._id, book.borrowedBookId)}
                                        className="bg-white text-black px-2 py-1 rounded border border-gray-300"
                                    >
                                        <option value="" disabled selected>Select Action</option>
                                        <option value="accept">Accept Renewal</option>
                                        <option value="reject">Reject Renewal</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ALLBookRenewalRequest;
