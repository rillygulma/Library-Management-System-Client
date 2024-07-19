import { FaUser, FaSearch, FaChevronRight, FaBook } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { MdQrCodeScanner } from "react-icons/md";
import { TbBookUpload } from "react-icons/tb";
import { GrUserWorker } from "react-icons/gr";
import { PiStudentFill } from "react-icons/pi";
import { FcReadingEbook } from "react-icons/fc";
import { RiAdminFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [staffUsers, setStaffUsers] = useState([]);
  const [studentUsers, setStudentUsers] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const fullName = localStorage.getItem('fullName');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const response = await axios.get('https://library-management-system-server-f0vl.onrender.com/api/admin/allusers', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        const users = response.data.users;
        const staffUsers = users.filter(user => user.role === "staff");
        const studentUsers = users.filter(user => user.role === "student");
        setStaffUsers(staffUsers);
        setStudentUsers(studentUsers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('fullName');
    localStorage.removeItem('token'); // or any other user-related data
    navigate('/login');
  };

  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  const formattedTime = currentTime.toLocaleTimeString('en-US');

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="lg:basis-[20%] lg:h-screen h-auto bg-blue-500 p-6 sm:p-4 flex flex-col justify-between">
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <div className="py-6 flex items-center justify-center border-b border-gray-300/30">
              <h1 className="text-white text-2xl font-extrabold cursor-pointer">ADMIN</h1>
            </div>
            <div className="flex items-center gap-4 py-5 border-b border-gray-300/30">
              <RiAdminFill className="text-white" />
              <p className="text-sm font-bold text-white">{fullName}</p>
            </div>
            <div className="pt-4 border-b border-gray-300/30">
              <p className="text-xs font-extrabold text-white/40">USERS MANAGEMENT</p>
              {[
                { icon: MdQrCodeScanner, label: "Barcode Scan", link: "/admin/scan" },
                { icon: GrUserWorker, label: "Manage Staff User", link: "/admin/staffusers" },
                { icon: PiStudentFill, label: "Manage Student User", link: "/admin/studentusers" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-2 py-2 hover:bg-blue-600/50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <item.icon className="text-white" />
                    <a className="text-sm font-normal text-white" href={item.link}>{item.label}</a>
                  </div>
                  <FaChevronRight className="text-white" />
                </div>
              ))}
            </div>
            <div className="pt-4 border-b border-gray-300/30">
              <p className="text-xs font-extrabold text-white/40">BOOK MANAGEMENT</p>
              {[
                { icon: TbBookUpload,   label: "Upload Books", link: "/admin/uploadbook" },
                { icon: FcReadingEbook, label: "Update Book Status", link: "/admin/updatebookstatus" },
                { icon: FaBook,         label: "Manage Books", link: "/admin/managebooks" },
                { icon: FcReadingEbook, label: "Update Book Return Date", link: "/admin/bookrenewal" },
                { icon: FcReadingEbook, label: "Borrow Book Request", link: "/admin/allborrowbookrequest" },
                { icon: FcReadingEbook, label: "Book Renewal Request", link: "/admin/allbookrenewalrequest" },
                { icon: FcReadingEbook, label: "Return Book Request", link: "/admin/allreturnbookrenewalrequest" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-2 py-2 hover:bg-blue-600/50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <item.icon className="text-white" />
                    <a className="text-sm font-normal text-white" href={item.link}>{item.label}</a>
                  </div>
                  <FaChevronRight className="text-white" />
                </div>
              ))}

          <div className="flex items-center gap-4 py-4 hover:bg-blue-900 cursor-pointer">
            <BiLogOut className="text-white" />
            <button className="transition ease-in-out delay-150 text-red-400 bg-blue-900 hover:-translate-y-1 hover:scale-110 hover:bg-blue-500 duration-300" onClick={handleLogout}>
              LOG OUT
            </button>
          </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:basis-[80%] bg-gray-100">
        {/* Dashboard View */}
        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-[70px] shadow-lg p-4 sm:px-6 space-y-4 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">WELCOME Back, Mr. {fullName}</h1>
          <div className="flex items-center w-full sm:w-auto space-x-2">
            <input 
              type="text" 
              className="bg-[#F8F9FC] h-[40px] outline-none pl-4 w-full sm:w-[350px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal" 
              placeholder='Search for...' 
            />
            <div className="bg-blue-600 h-[40px] px-4 flex items-center justify-center cursor-pointer rounded-[5px]">
              <FaSearch color="white" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-[70px] p-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 bg-white p-4 rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-lg font-medium text-gray-700">{formattedDate}</h2>
            <h2 className="text-lg font-bold  bg-black text-blue-700">{formattedTime}</h2>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="pt-6 px-6">
          <div>
            <h1 className="text-gray-600 text-2xl leading-8 font-normal cursor-pointer">Dashboard</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pb-4">
            <div className="h-24 rounded-lg bg-white border-l-4 border-[#4E73DF] flex items-center justify-between px-6 shadow cursor-pointer hover:shadow-lg transform hover:scale-105 transition duration-300 ease-out">
              <div>
                <h2 className="text-[#4E73DF] text-xs leading-4 font-bold">STAFF USERS</h2>
                <h1 className="text-xl leading-6 font-bold text-gray-800 mt-1">{staffUsers.length}</h1>
              </div>
              <FaUser fontSize={28} className="text-gray-600" />
            </div>
            <div className="h-24 rounded-lg bg-white border-l-4 border-[#4E73DF] flex items-center justify-between px-6 shadow cursor-pointer hover:shadow-lg transform hover:scale-105 transition duration-300 ease-out">
              <div>
                <h2 className="text-[#4E73DF] text-xs leading-4 font-bold">STUDENT USERS</h2>
                <h1 className="text-xl leading-6 font-bold text-gray-800 mt-1">{studentUsers.length}</h1>
              </div>
              <FaUser fontSize={28} className="text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
