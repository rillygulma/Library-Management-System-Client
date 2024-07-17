import { useState } from 'react';
import { AiOutlineMail, AiOutlineLock, AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Import eye icons
import axios from 'axios';
import Logo from "./fubk-logo.jpg";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate(); // Use useNavigate for cleaner navigation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner

  const handlePasswordVisibilityToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true); // Start loading spinner

    try {
      const response = await axios.post('https://fubk-library-management-sytem-server.onrender.com/api/users/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Response Data:", response.data); // Log response data

      const userData = response.data;
      const userRole = userData.data.role;

      console.log("User Data", userData);
      console.log("user Id", userData.data._id);
      console.log("User token:", userData.accessToken); // Log user token
      // console.log("User Fullname:", userData.data.fullName);
      // console.log("User_Id", userData.data._id);

      localStorage.setItem("user_id", userData.data._id);
      localStorage.setItem("token", userData.accessToken);
      localStorage.setItem("fullName", userData.data.fullName);
      localStorage.setItem("role", userData.data.role);
      localStorage.setItem("phoneNo", userData.data.phoneNo);
      localStorage.setItem("staffNo", userData.data.staffNo);
      localStorage.setItem("admissionNo", userData.data.admissionNo);
      localStorage.setItem("email", userData.data.email);

      let redirectPath;
      switch (userRole) {
        case "staff":
          redirectPath = "/staff/dashboard";
          break;
        case "student":
          redirectPath = "/student/dashboard";
          break;
        default:
          redirectPath = "/admin/dashboard";
      }

      navigate(redirectPath);
      toast.success("You have successfully logged in!");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Email or Password are incorrect. Please try again.');
      }
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="max-w-md w-full border px-10 py-20 rounded-md bg-blue-500 shadow-lg">
        <div>
          <img src={Logo} alt="Logo" className='mx-auto w-1/2 h-1/2 rounded md:w-48 lg:w-56' />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineMail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 mb-5 py-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} // Toggle between text and password type
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {showPassword ? (
                    <AiFillEyeInvisible onClick={handlePasswordVisibilityToggle} className="h-5 w-5 text-gray-400 cursor-pointer" aria-hidden="true" />
                  ) : (
                    <AiFillEye onClick={handlePasswordVisibilityToggle} className="h-5 w-5 text-gray-400 cursor-pointer" aria-hidden="true" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <div className="flex justify-between items-center">
            <Link to="/forget-password" className="text-sm text-black font-bold hover:underline ml-auto">
              Forgot Password?
            </Link>
          </div>
          <p className="mt-4 font-bold text-gray-900">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-white ml-2 hover:text-black">
              Sign up now
            </Link>
          </p>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
