import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaBook, FaChevronRight, FaBookOpen } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";
import { AiOutlineRobot } from "react-icons/ai";

const StaffDashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            axios.get("https://fubk-library-management-sytem-server.onrender.com/api/users/allbooks", {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                const responseData = response.data.data;
                console.log(responseData);
                setData(responseData);
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle error
            });
        }
    }, []);
    
    useEffect(() => {
        const intervalId = setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);
    
        return () => clearInterval(intervalId);
      }, []);
    
    const handleLogOut = () => {
        localStorage.removeItem('token');
        navigate("/login");
    };

    const formattedDate = currentTime.toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      });
      const formattedTime = currentTime.toLocaleTimeString('en-US');
    

    const fullName = localStorage.getItem('fullName');

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Sidebar */}
            <div className="lg:order-1 lg:basis-[20%] lg:h-screen h-auto bg-blue-500 p-6 sm:p-4 flex flex-col">
                <div className="py-6 flex items-center justify-center border-b border-gray-300/30">
                    <h1 className="text-white text-2xl font-extrabold cursor-pointer">STAFF</h1>
                </div>
                <div className="flex items-center gap-4 py-5 border-b border-gray-300/30">
                    <RiAdminFill className="text-white" />
                    <p className="text-sm font-bold text-white">{fullName}</p>
                </div>
                <div className="pt-4 border-b border-gray-300/30">
                    <p className="text-xs font-extrabold text-white/40">Circulation Section</p>
                    {[
                        { icon: AiOutlineRobot, label: "ASK FUBK AI", link: "/users/fubkAi" },
                        { icon: FaBookOpen, label: "Search For Books", link: "/users/allbooks" },
                    ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between gap-4 py-4 hover:shadow-lg transform hover:scale-105 transition duration-300 ease-out cursor-pointer">
                            <div className="flex items-center gap-4">
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
                        { icon: FaSearch, label: "Serial Search", link: "/users/serialSearch" },
                        { icon: FaSearch, label: "Advance Search Book", link: "/users/advanceSearch" },
                        { icon: FaBook, label: "Borrowed History", link: "/user/borrowHistory/" },
                        ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between gap-4 py-4 hover:bg-blue-600/50 cursor-pointer">
                            <div className="flex items-center gap-4">
                                <item.icon className="text-white" />
                                <a className="text-sm font-normal text-white" href={item.link}>{item.label}</a>
                            </div>
                            <FaChevronRight className="text-white" />
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <div className="flex items-center gap-4 py-4 hover:bg-blue-900 cursor-pointer">
                        <BiLogOut className="text-white text-3xl" />
                        <button className="transition ease-in-out delay-150 text-red-400 bg-blue-900 hover:-translate-y-1 hover:scale-110 hover:bg-blue-500 duration-300" onClick={handleLogOut}>LOGOUT</button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:order-2 lg:basis-[80%] bg-gray-100">
                {/* Dashboard View */}
                <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-[70px] shadow-lg p-4 sm:px-6 space-y-4 sm:space-y-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">WELCOME Back, {fullName}</h1>
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
                                <h2 className="text-[#4E73DF] text-xs leading-4 font-bold">ALL BOOKS</h2>
                                <h1 className="text-xl leading-6 font-bold text-gray-800 mt-1">{data ? data.length : 'Loading...'}</h1>
                            </div>
                            <FaBook fontSize={28} className="text-gray-600" />
                        </div>
                        <div className="h-24 rounded-lg bg-white border-l-4 border-[#4E73DF] flex items-center justify-between px-6 shadow cursor-pointer hover:shadow-lg transform hover:scale-105 transition duration-300 ease-out">
                            <div>
                                <h2 className="text-[#4E73DF] text-xs leading-4 font-bold">RECENT BOOKS</h2>
                                <h1 className="text-xl leading-6 font-bold text-gray-800 mt-1">{ 'Loading...'}</h1>
                            </div>
                            <FaBook fontSize={28} className="text-gray-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
