import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { RiContactsLine } from 'react-icons/ri';
import { TiGroup } from 'react-icons/ti';
import { IoIosSchool } from 'react-icons/io';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {toast} from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    fullName: '',
    role: 'staff',
    admissionNo: '',
    staffNo: '',
    department: '',
    phoneNo: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      role: value,
      admissionNo: value === 'student' ? '' : formData.admissionNo,
      staffNo: value === 'staff' ? '' : formData.staffNo,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Create a copy of formData to modify
    const dataToSend = { ...formData };
    // Remove admissionNo if role is staff
    if (formData.role === 'staff') {
      delete dataToSend.admissionNo;
    }
    // Remove staffNo if role is student
    if (formData.role === 'student') {
      delete dataToSend.staffNo;
    }
    try {
      const response = await axios.post('https://fubk-library-management-sytem-server.onrender.com/api/users/register', dataToSend, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log(response.data); // Handle successful response
      toast.success("User created successfully!");
      navigate("/login");
    } catch (error) {
      console.error('Error submitting form:', error); // Handle error
      toast.error("Error creating user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="max-w-md mx-auto border rounded-md bg-blue-500 mt-20 px-6 py-8 sm:px-10 sm:py-10">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 sm:gap-x-6 sm:grid-cols-2">
          <h1 className="text-2xl font-semibold col-span-2 mb-4 text-center">Join the Library Community</h1>
          <span className='text-2xl font-semibold col-span-2 mb-4 text-center text-blue-200'>of Federal University Birnin Kebbi.</span>
          <div className="relative">
            <label htmlFor="fullName" className="block flex-1">Full Name</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            <span className="text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"><FaUser /></span>
          </div>

          <div className="relative">
            <label htmlFor="role" className="block flex-1">Role</label>
            <select id="role" name="role" value={formData.role} onChange={handleRoleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2">
              <option value="staff">Staff</option>
              <option value="student">Student</option>
            </select>
            {formData.role === 'student' ? <span className="text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"><IoIosSchool /></span> : <span className="text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"><TiGroup /></span>}
          </div>

          {formData.role === 'student' && (
            <div className="relative">
              <label htmlFor="admissionNo" className="block flex-1">Admission Number</label>
              <input type="text" id="admissionNo" name="admissionNo" value={formData.admissionNo} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2" />
              <span className="text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"><RiContactsLine /></span>
            </div>
          )}

          {formData.role === 'staff' && (
            <div className="relative">
              <label htmlFor="staffNo" className="block flex-1">Staff Number</label>
              <input type="text" id="staffNo" name="staffNo" value={formData.staffNo} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2" />
              <span className="text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"><TiGroup /></span>
            </div>
          )}

          <div className="relative col-span-2">
            <label htmlFor="department" className="block flex-1">Department</label>
            <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2" />
            <span className="text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"><RiContactsLine /></span>
          </div>

          <div className="relative col-span-2">
            <label htmlFor="phoneNo" className="block flex-1">Phone Number</label>
            <input type="text" id="phoneNo" name="phoneNo" value={formData.phoneNo} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2" />
            <span className="text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"><RiContactsLine /></span>
          </div>

          <div className="relative col-span-2">
            <label htmlFor="email" className="block flex-1">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2" />
            <span className="text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"><FaEnvelope /></span>
          </div>

          <div className="relative col-span-2">
            <label htmlFor="password" className="block flex-1">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2" />
            <span className="text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"><FaLock /></span>
          </div>

          <button type="submit" className="col-span-2 bg-blue-900 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          <p className="text-center col-span-2">
            Already have an account? <Link to="/login" className="text-red-500">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
