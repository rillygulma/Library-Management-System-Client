import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const UpdateBookStatus = () => {
    const [bookId, setBookId] = useState('');
    const [status, setStatus] = useState('available');
    const [message, setMessage] = useState('');
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const handleStatusChange = (event, id) => {
        setBookId(id);
        setStatus(event.target.value);
    };

    const handleUpdate = async (id, currentStatus) => {
        setBookId(id);
        setStatus(currentStatus);
        setLoading(true);
        try {
            const accessToken = localStorage.getItem('token');
            const response = await axios.put(
                `https://library-management-system-server-f0vl.onrender.com/api/admin/updatebook/${id}`,
                { status: currentStatus },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );
            console.log(response.data);
            setMessage(`Book status updated: ${response.data.message}`);
            toast.success('Book status updated successfully');
            fetchBooks();
        } catch (error) {
            setMessage(`Error: ${error.response ? error.response.data.message : 'Server is not responding'}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem('token');
            const response = await axios.get('https://library-management-system-server-f0vl.onrender.com/api/users/allbooks', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log(response.data);
            if (response.data && Array.isArray(response.data.data)) {
                setBooks(response.data.data);
            } else {
                console.error("Unexpected response data format:", response.data);
                toast.error('Unexpected response data format');
            }
        } catch (error) {
            toast.error('Failed to fetch books');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const filteredBooks = books.filter(book =>
        book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="bg-blue-300 shadow-md rounded-lg p-6 w-full max-w-4xl mb-8">
                <h2 className="text-xl font-bold text-white text-center mt-10 bg-slate-600 mb-4 uppercase">Books List</h2>
                <input
                    type="text"
                    placeholder="Search by Title, Author, or ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {loading ? (
                    <div className="flex justify-center items-center">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 bg-blue-300 text-left text-xs font-medium text-black uppercase tracking-wider">S/N</th>
                                <th className="px-6 py-3 bg-blue-300 text-left text-xs font-medium text-black uppercase tracking-wider">Book Barcode</th>
                                <th className="px-6 py-3 bg-blue-300 text-left text-xs font-medium text-black uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 bg-blue-300 text-left text-xs font-medium text-black uppercase tracking-wider">Author</th>
                                <th className="px-6 py-3 bg-blue-300 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 bg-blue-300 text-left text-xs font-medium text-black uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Array.isArray(filteredBooks) && filteredBooks.map((book, index) => (
                                <tr key={book._id}>
                                    <td className="px-6 py-4 bg-blue-300 whitespace-nowrap text-sm text-black">{index + 1}</td>
                                    <td className="px-6 py-4 bg-blue-300 whitespace-nowrap text-sm text-black">{book.bookBarcode}</td>
                                    <td className="px-6 py-4 bg-blue-300 whitespace-nowrap text-sm text-black">{book.bookTitle}</td>
                                    <td className="px-6 py-4 bg-blue-300 whitespace-nowrap text-sm text-black">{book.authorName}</td>
                                    <td className="px-6 py-4 bg-blue-300 whitespace-nowrap text-sm text-black">
                                        {book.status === 'borrowed' ? (
                                            <select
                                                value={book._id === bookId ? status : book.status}
                                                onChange={(e) => handleStatusChange(e, book._id)}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 bg-blue-300 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            >
                                                <option value="available">Available</option>
                                                <option value="checked out">Checked Out</option>
                                                <option value="reserved">Reserved</option>
                                                <option value="lost">Lost</option>
                                                <option value="overdue">Overdue</option>
                                            </select>
                                        ) : (
                                            book.status
                                        )}
                                    </td>
                                    <td className="px-6 py-4 bg-blue-300 whitespace-nowrap text-sm text-black">
                                        {book.status === 'pending' && (
                                            <button
                                                onClick={() => handleUpdate(book._id, status)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Update
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
        </div>
    );
};

export default UpdateBookStatus;
