import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Shop from './pages/Shop';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './Login';
import Purchase_history from './components/Purchase_history';
import Clubs from './pages/Clubs';
import Rating from './pages/Rating';
import Reyting from './pages/Reyting';
import Posts from './pages/Posts';
import PrivateRoute from './PrivateRoute';
import Profil from './pages/Profil';
import About from './pages/Abaut';
import ClubProfile from './pages/ClubProfil';
import { ArrowLeft, ArrowRight } from 'lucide-react';


const App = () => {

  const location = useLocation();
  const hideSidebarRoutes = ['/'];
  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarState");
    return savedState !== "hide";
  });
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser && loggedInUser.email === "guest@example.com") {
      setIsGuest(true); // If the email is guest, set the guest flag
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      if (isNowMobile) {
        setIsOpen(false); // Close sidebar when on mobile
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false); // Close the sidebar on route change for mobile devices
    }
  }, [location, isMobile]);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem("sidebarState", newState ? "open" : "hide");
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {shouldShowSidebar && (
        <Sidebar
          isMobile={isMobile}
          isOpen={isOpen}
          toggleSidebar={toggleSidebar}
          isGuest={isGuest} // Pass the guest status to the sidebar
        />
      )}

      <div className={`flex-grow pb-20 md:pb-0 ${shouldShowSidebar ? (isOpen ? 'md:ml-[250px]' : 'md:ml-[80px]') : ''} transition-all duration-300`}>
        {!isMobile && shouldShowSidebar && (
          <button
          className="fixed mt-[280px] mr-[100px] h-[80px] w-[30px] bg-indigo-500 z-50 text-white p-2 shadow-lg hover:bg-indigo-600 transition-all"
          onClick={toggleSidebar}
          style={{
            clipPath: 'polygon(0 0, 100% 50%, 0 100%)', // Uchini yaxshiroq ko‘rinishi uchun
          }}
        >
          {isOpen ? <ArrowLeft /> : <ArrowRight />}
        </button>
        
        )}

        <Routes>
          {/* Login Page */}
          <Route path="/" element={<Login />} />

          {/* Private Routes based on whether the user is logged in or a guest */}
          <Route
            path="/home"
            element={
              <PrivateRoute guestOnly={false}>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute guestOnly={false}>
                <Profil />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <PrivateRoute guestOnly={true}>
                <Posts />
              </PrivateRoute>
            }
          />
          <Route
            path="/shop"
            element={
              <PrivateRoute guestOnly={true}>
                <Shop />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute guestOnly={false}>
                <Purchase_history />
              </PrivateRoute>
            }
          />
          <Route
            path="/clubs"
            element={
              <PrivateRoute guestOnly={true}>
                <Clubs />
              </PrivateRoute>
            }
          />
          <Route
            path="/rating"
            element={
              <PrivateRoute guestOnly={false}>
                <Reyting />
              </PrivateRoute>
            }
          />
          <Route
            path="/clubprofile"
            element={
              <PrivateRoute guestOnly={false}>
                <ClubProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PrivateRoute guestOnly={false}>
                <About />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App