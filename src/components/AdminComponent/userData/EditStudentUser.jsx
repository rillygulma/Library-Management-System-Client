import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const EditStaffUser = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullName: '',
    admissionNo: '',
    department: '',
    phoneNo: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const response = await axios.get(`https://fubk-library-management-sytem-server.onrender.com/api/admin/user/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        setFormData(response.data);
        console.log(response.data);

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem('token');

    try {
      const response = await axios.put(`https://fubk-library-management-sytem-server.onrender.com/api/admin/updateuser/${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      toast.success('User data updated successfully');

      console.log('User data updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating user:', error.message);
      toast.error('Error updating user:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Edit User
          </h2>
        </div>
        <form className="mt-8 space-y-6 border border-gray-300 p-6 rounded-md shadow-sm" onSubmit={handleSubmit}>
  <div className="space-y-4">
    <div>
      <label htmlFor="fullName" className="sr-only">Full Name</label>
      <input
        id="fullName"
        name="fullName"
        type="text"
        autoComplete="name"
        required
        className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
      />
    </div>
    <div>
      <label htmlFor="admissionNo" className="sr-only">Admission No</label>
      <input
        id="admissionNo"
        name="admissionNo"
        type="text"
        autoComplete="admissionNo"
        required
        className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Admission No"
        value={formData.admissionNo}
        onChange={handleChange}
      />
    </div>
    <div>
      <label htmlFor="department" className="sr-only">Department</label>
      <input
        id="department"
        name="department"
        type="text"
        autoComplete="department"
        required
        className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Department"
        value={formData.department}
        onChange={handleChange}
      />
    </div>
    <div>
      <label htmlFor="phoneNo" className="sr-only">Phone Number</label>
      <input
        id="phoneNo"
        name="phoneNo"
        type="text"
        autoComplete="text"
        required
        className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Phone Number"
        value={formData.phoneNo}
        onChange={handleChange}
      />
    </div>
    <div>
      <label htmlFor="email" className="sr-only">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
    </div>
    <div>
      <label htmlFor="role" className="sr-only">Role</label>
      <input
        id="role"
        name="role"
        type="text"
        autoComplete="role"
        required
        className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Role"
        value={formData.role}
        onChange={handleChange}
      />
    </div>
  </div>

  <div>
    <button
      type="submit"
      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Save Changes
    </button>
  </div>
</form>
      </div>
    </div>
  );
};

export default EditStaffUser;

