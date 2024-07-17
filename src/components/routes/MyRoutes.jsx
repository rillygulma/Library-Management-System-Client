import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../home/Home";
import Register from "../userComponent/Register";
import Login from "../userComponent/Login";
import StaffUserData from "../AdminComponent/userData/StaffUserData";
import StudentuserData from "../AdminComponent/userData/StudentuserData";
import UploadBooks from "../AdminComponent/booksData/UploadBooks";
import SingleBook from "../AdminComponent/booksData/SingleBook";
import AllBooks from "../AdminComponent/booksData/AllBooks";
import EditStaffUser from "../AdminComponent/userData/EditStaffUser";
import EditStudentUser from "../AdminComponent/userData/EditStudentUser";
import UserBorrowHistory from "../borrowBook/UserBorrowHistory";
import AdvanceSearch from "../advanceSearch/AdvanceSearch";
import SerialSearch from "../serialSearch/SerialSearch";
import ForgotPassword from "../userComponent/ForgetPassword";
import ManageBooks from "../AdminComponent/booksData/ManageBooks";
import EditBook from "../AdminComponent/booksData/EditBook";
import BookRenewal from "../AdminComponent/booksData/BookRenewal";
import ReturnBookRequest from "../borrowBook/BookReturnRequest";
import UpdateBookStatus from "../AdminComponent/booksData/UpdateBookStatus";
import BookRenewalRequest from "../borrowBook/BookRenewalRequest";
import AllBookRenewalRequest from "../borrowBook/ALLBookRenewalRequest";
import AllReturnBookRequest from "../borrowBook/AllReturnBookRequest";
import AdminDashboard from "../AdminComponent/AdminDashboard";
import StaffDashboard from "../staffComponents/staffDashboard/StaffDashboard";
import StudentDashboard from "../studentComponents/StudentDashboard";
import AllBorrowBookRequest from "../borrowBook/AllBorrowBookRequest";
import ChatAi from "../staffComponents/ChatAi";


const MyRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/staffusers" element={<StaffUserData />} />
          <Route path="/admin/editstaffusers/:id" element={<EditStaffUser />} />
          <Route path="/admin/editstudentusers/:id" element={<EditStudentUser />} />
          <Route path="/admin/studentusers" element={<StudentuserData />} />
          <Route path="/admin/uploadbook" element={<UploadBooks />} />
          <Route path="/admin/updatebookstatus" element={<UpdateBookStatus />} />
          <Route path="/admin/managebooks" element={<ManageBooks />} />
          <Route path="/admin/editbook/:id" element={<EditBook />} />
          <Route path="/users/allbooks" element={<AllBooks />} />
          <Route path="/user/singlebook/:id" element={<SingleBook />} />
          <Route path="/user/bookrenewalrequest" element={<BookRenewalRequest />} />
          <Route path="/user/returnbookrequest/:id" element={<ReturnBookRequest />} />
          <Route path="/admin/allbookrenewalrequest" element={<AllBookRenewalRequest />} />
          <Route path="/admin/allborrowbookrequest" element={<AllBorrowBookRequest />} />
          <Route path="/admin/allreturnbookrenewalrequest" element={<AllReturnBookRequest />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/users/fubkAi" element={<ChatAi />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          {/* <Route path="/user/borrowers/:id" element={<BorrowersInfo />} /> */}
          <Route path="/admin/bookrenewal" element={<BookRenewal />} />
          <Route path="/user/borrowHistory/" element={<UserBorrowHistory />} />
          <Route path="/users/advanceSearch" element={<AdvanceSearch />} />
          <Route path="/users/serialSearch" element={<SerialSearch />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default MyRoutes;
