import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const StaffUserData = () => {
  const navigate = useNavigate();

  const [staffUsers, setStaffUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const response = await axios.get('https://fubk-library-management-sytem-server.onrender.com/api/admin/allusers', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        const staffUsers = response.data.users.filter(users => users.role === "staff");
        //console.log("Response", staffUsers);
        setStaffUsers(staffUsers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/editstaffusers/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = alert('Are you sure you want to delete this user?');

    if (confirmDelete) {
      try {
        const accessToken = localStorage.getItem('token');
        const response = await axios.delete(`https://fubk-library-management-sytem-server.onrender.com/api/admin/deleteuser/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.data.success) {
          toast.success('User deleted successfully! 🗑️');
          // Optionally update the state or refetch data here if needed
        } else {
          toast.error('An error occurred while deleting the user. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('An error occurred while deleting the user. Please try again.');
      }
    }
  };  

  return (
    <div className="container mx-auto">
      <h2 className="text-xl font-bold text-white text-center mt-10 bg-slate-600 mb-4 uppercase">Staff User Table</h2>
      <table className="min-w-full table-auto border bg-blue-300 border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 px-4 py-2">No</th>
            <th className="border border-gray-200 px-4 py-2">Full Name</th>
            <th className="border border-gray-200 px-4 py-2">Staff No</th>
            <th className="border border-gray-200 px-4 py-2">Department</th>
            <th className="border border-gray-200 px-4 py-2">Phone No</th>
            <th className="border border-gray-200 px-4 py-2">Email</th>
            <th className="border border-gray-200 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffUsers.map((user, index) => (
            <tr key={user.id}>
              <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-200 px-4 py-2">{user.fullName}</td>
              <td className="border border-gray-200 px-4 py-2">{user.staffNo}</td>
              <td className="border border-gray-200 px-4 py-2">{user.department}</td>
              <td className="border border-gray-200 px-4 py-2">{user.phoneNo}</td>
              <td className="border border-gray-200 px-4 py-2">{user.email}</td>
              <td className="border border-gray-200 px-4 py-2">
              <button onClick={() => handleEdit(user._id)} 
                className="font-medium text-white bg-green-600 hover:bg-green-700 hover:underline px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition ease-in-out duration-300 mr-5">
                Edit
              </button>

              <button onClick={() => handleDelete(user._id)} 
                className="ml-2 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition ease-in-out duration-300">
                Delete
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffUserData;
