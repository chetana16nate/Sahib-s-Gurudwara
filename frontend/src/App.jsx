import React from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";


// ======================================================
// USER PAGES
// ======================================================

import UserLogin from "./pages/User/UserLogin/UserLogin";
import UserRegister from "./pages/User/UserRegister/UserRegister";
import ForgotPassword from "./pages/User/ForgotPassword/ForgotPassword";

import UserDashboard from "./pages/User/UserDashboard/UserDashboard";

import LangarBooking from "./pages/User/LangarBooking/LangarBooking";
import BookingSuccess from "./pages/User/BookingSuccess/BookingSuccess";
import MyBookings from "./pages/User/MyBookings/MyBookings";


// ======================================================
// ADMIN PAGES
// ======================================================

import AdminLogin from "./pages/Admin/AdminLogin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminBookings from "./pages/Admin/AdminBookings/AdminBookings";
import AdminAvailability from "./pages/Admin/AdminAvailability/AdminAvailability";
import AdminReports from "./pages/Admin/AdminReports/AdminReports";
import AdminPrograms from "./pages/Admin/AdminPrograms/AdminPrograms";
import AdminUsers from "./pages/Admin/AdminUsers/AdminUsers";

// ======================================================
// PUBLIC PAGES
// ======================================================

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Services from "./pages/Services/Services";

// â­ NEW PROGRAMS PAGE
import Programs from "./pages/Programs/Programs";
import SevaBooking from "./pages/SevaBooking/SevaBooking";

import HealthcareCamps
    from "./pages/Services/HealthcareCamps/HealthcareCamps";

import ClassesActivities
    from "./pages/Services/ClassesActivities/ClassesActivities";

import Contact from "./pages/Contact/Contact";
import Gallery from "./pages/Gallery/Gallery";
import Reviews from "./pages/Reviews/Reviews";
import Cafe from "./pages/Cafe/Cafe";

import NotFound from "./pages/NotFound/NotFound";
import Layout from "./components/Layout/Layout";
import SeoManager from "./components/SeoManager";


// ======================================================
// USER PROTECTED ROUTE
// ======================================================

function UserProtectedRoute({ children }) {

    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
        return (
            <Navigate
                to="/user/login"
                replace
            />
        );
    }

    return children;
}


// ======================================================
// ADMIN PROTECTED ROUTE
// ======================================================

function AdminProtectedRoute({ children }) {

    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );
    }

    return children;
}


// ======================================================
// APP
// ======================================================

function App() {

    return (

        <BrowserRouter>

            <SeoManager />

            <Routes>

                {/* ==================================================
                    PUBLIC
                ================================================== */}

                <Route element={<Layout />}>
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/about"
                    element={<About />}
                />

                <Route
                    path="/services"
                    element={<Services />}
                />


                {/* ==================================================
                    â­ PROGRAMS
                ================================================== */}

                <Route
                    path="/programs"
                    element={<Programs />}
                />


                {/* ==================================================
                    SERVICES SUB-PAGES
                ================================================== */}

                <Route
                    path="/services/healthcare-camps"
                    element={<HealthcareCamps />}
                />

                <Route
                    path="/services/classes-activities"
                    element={<ClassesActivities />}
                />


                {/* ==================================================
                    CONTACT
                ================================================== */}

                                <Route path="/seva" element={<SevaBooking />} />
                <Route
                    path="/contact"
                    element={<Contact />}
                />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/cafe" element={<Cafe />} />
                </Route>


                {/* ==================================================
                    USER AUTHENTICATION
                ================================================== */}

                <Route
                    path="/user/login"
                    element={<UserLogin />}
                />

                {/* OLD LOGIN URL */}
                <Route
                    path="/login"
                    element={
                        <Navigate
                            to="/user/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/user-login"
                    element={
                        <Navigate
                            to="/user/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/user/register"
                    element={<UserRegister />}
                />
                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                {/* OLD REGISTER URL */}
                <Route
                    path="/register"
                    element={
                        <Navigate
                            to="/user/register"
                            replace
                        />
                    }
                />


                {/* ==================================================
                    USER DASHBOARD
                ================================================== */}

                <Route
                    path="/user/dashboard"
                    element={
                        <UserProtectedRoute>
                            <UserDashboard />
                        </UserProtectedRoute>
                    }
                />

                {/* OLD DASHBOARD URL */}
                <Route
                    path="/dashboard"
                    element={
                        <Navigate
                            to="/user/dashboard"
                            replace
                        />
                    }
                />


                {/* ==================================================
                    LANGAR BOOKING
                ================================================== */}

                <Route
                    path="/user/langar-booking"
                    element={
                        <UserProtectedRoute>
                            <LangarBooking />
                        </UserProtectedRoute>
                    }
                />

                {/* SHORT LANGAR URL */}
                <Route
                    path="/langar"
                    element={
                        <Navigate
                            to="/user/langar-booking"
                            replace
                        />
                    }
                />


                {/* ==================================================
                    BOOKING SUCCESS
                ================================================== */}

                <Route
                    path="/user/booking-success"
                    element={
                        <UserProtectedRoute>
                            <BookingSuccess />
                        </UserProtectedRoute>
                    }
                />

                {/* OLD BOOKING SUCCESS URL */}
                <Route
                    path="/booking-success"
                    element={
                        <Navigate
                            to="/user/booking-success"
                            replace
                        />
                    }
                />


                {/* ==================================================
                    MY BOOKINGS
                ================================================== */}

                <Route
                    path="/user/my-bookings"
                    element={
                        <UserProtectedRoute>
                            <MyBookings />
                        </UserProtectedRoute>
                    }
                />

                {/* OLD MY BOOKINGS URL */}
                <Route
                    path="/my-bookings"
                    element={
                        <Navigate
                            to="/user/my-bookings"
                            replace
                        />
                    }
                />


                {/* ==================================================
                    ADMIN
                ================================================== */}

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                <Route
                    path="/admin"
                    element={
                        <Navigate
                            to="/admin/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboard />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/bookings"
                    element={
                        <AdminProtectedRoute>
                            <AdminBookings />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/availability"
                    element={
                        <AdminProtectedRoute>
                            <AdminAvailability />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/programs"
                    element={
                        <AdminProtectedRoute>
                            <AdminPrograms />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/reports"
                    element={
                        <AdminProtectedRoute>
                            <AdminReports />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/users"
                    element={
                        <AdminProtectedRoute>
                            <AdminUsers />
                        </AdminProtectedRoute>
                    }
                />


                {/* ==================================================
                    404
                ================================================== */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;









