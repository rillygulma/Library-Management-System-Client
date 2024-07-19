import { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineUser } from 'react-icons/ai';
import { FaBarcode, FaRegAddressBook } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const EditBook = () => {
  const { id } = useParams();
  const categories = [
    "Accounting", "Anatomy", "Applied Geophysics", "Architecture", "Biochemistry",
    "Biology", "Building Technology", "Business Administration", "Chemistry", "Computer Science",
    "Demography & Social Statistics", "Economics", "Education & English Language", "Geography",
    "Geology", "History & International Studies", "Industrial Chemistry", "Mathematics",
    "Medicine & Surgery", "Microbiology", "Nursing/Nursing Science", "Physics With Electronics",
    "Physiology", "Political Science", "Quantity Survey", "Sociology", "Statistic"
  ];

  const [formData, setFormData] = useState({
    authorName: '',
    bookTitle: '',
    placeOfPub: '',
    publisher: '',
    yearPublished: '',
    isbn: '',
    bookImageUrl: '',
    category: '',
    edition: '',
    bookDescription: '',
    bookBarcode: '',
    status: ''
  });

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://library-management-system-server-f0vl.onrender.com/api/users/singlebook/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const bookData = response.data;
        setFormData(bookData);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://library-management-system-server-f0vl.onrender.com/api/admin/updatebook/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      toast.success("Book Update Sucessfuly")
      console.log(response.data);
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Error updating book:', error);
    }
  };

  return (
    <div className="bg-blue-300 max-w-md mx-auto mt-8 p-4 border rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Edit Book</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          <span className="text-lg sm:text-base"><AiOutlineUser />Author Name:</span>
          <input
            type="text"
            name="authorName"
            value={formData.authorName}
            onChange={handleChange}
            className="form-input mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </label>
        <label className="block mb-4">
          <span className="text-lg sm:text-base"><FaRegAddressBook />Book Title:</span>
          <input
            type="text"
            name="bookTitle"
            value={formData.bookTitle}
            onChange={handleChange}
            className="form-input mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </label>
        <label className="block mb-4">
        <span className="text-lg sm:text-base">Place Of Publication:</span>
      <input
        type="text"
        name="PlaceOfPub"
        value={formData.PlaceOfPub}
        onChange={handleChange}
        className="form-input mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </label>

      <label className="block mb-4">
        <span className="text-lg sm:text-base">Publisher:</span>
      <input
        type="text"
        name="publisher"
        value={formData.publisher}
        onChange={handleChange}
        className="form-input mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </label>

      <label className="block mb-4">
        <span className="text-lg sm:text-base">Year Published:</span>
      <input
        type="text"
        name="yearPublished"
        value={formData.yearPublished}
        onChange={handleChange}
        className="form-input mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </label>

      <label className="block mb-4">
        <span className="text-lg sm:text-base">Isbn:</span>
      <input
        type="text"
        name="isbn"
        value={formData.isbn}
        onChange={handleChange}
        className="form-input mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </label>

      <label className="block mb-4">
        <span className="text-lg sm:text-base">Book Image Url:</span>
      <input
        type="text"
        name="bookImageUrl"
        value={formData.bookImageUrl}
        onChange={handleChange}
        className="form-input mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </label>

      <div className="block mb-4">
          <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">Category</label>
          <select
            id="category"
            name="category"
            className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:border-blue-500"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          </div>
      
      <label className="block mb-4">
        <span className="text-lg sm:text-base">Edition:</span>
      <input
        type="text"
        name="edition"
        value={formData.edition}
        onChange={handleChange}
        className="form-input mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </label>

      <label className="block mb-4">
        <span className="text-lg sm:text-base">Book Description:</span>
      <textarea
        name="bookDescription"
        value={formData.bookDescription}
        onChange={handleChange}
        className="form-input mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </label>

      <label className="block mb-4">
        <span className="text-lg sm:text-base">Other:</span>
      <input
        type="text"
        name="other"
        value={formData.others}
        onChange={handleChange}
        className="form-input mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </label>

    <label className="block mb-4">
      <span className="text-lg sm:text-base"><FaBarcode />Book Barcode:</span>
      <input
        type="text"
        name="bookBarcode"
        value={formData.bookBarcode}
        onChange={handleChange}
        className="form-input mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
      />
    </label>

    <div className="mb-4">
      <label className="block text-black text-sm font-bold mb-2">Book Status:</label>
      <select
        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        name="status" 
        value={formData.status}
        onChange={handleChange}
      >
        <option value="">Select Status</option>
        <option value="available">Available</option>
      </select>
    </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update Book
        </button>
      </form>
    </div>
  );
};

export default EditBook;

