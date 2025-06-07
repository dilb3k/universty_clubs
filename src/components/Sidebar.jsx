import React, { useEffect, useRef } from "react";
import {
  Users,
  Home,
  ShoppingBag,
  ClubIcon as Clubs,
  User,
  FileText,
  Star,
  LogOut,
  Menu,
  Coins,
  CoinsIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { FiInfo } from "react-icons/fi";

const Sidebar = ({ isMobile, isOpen, toggleSidebar }) => {
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Shop", href: "/shop", icon: ShoppingBag },
    { name: "Clubs", href: "/clubs", icon: Clubs },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Posts", href: "/posts", icon: FileText },
    { name: "Rating", href: "/rating", icon: Star },
    { name: "Abaut", href: "/about", icon: FiInfo },
  ];

  // Get logged-in user details from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};

  // Define which links to show based on user's role
  const userRole = loggedInUser.role || "guest"; // Default to 'guest' if no role is found
  const filteredNavigation = userRole === "guest"
    ? navigation.filter(item => ["Shop", "Clubs", "Posts"].includes(item.name)) // Show only these links for guests
    : navigation; // Show all for other roles

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    console.log("Logged out!");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {

      if (
        isOpen &&
        isMobile &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {

        toggleSidebar(); // Close the sidebar
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isMobile, toggleSidebar]);

  return (
    <div className="fixed z-20 top-0 left-0">
      {/* Mobile Toggle Button */}
      <button
        ref={toggleButtonRef}
        className="md:hidden fixed top-4 left-4 z-50 bg-indigo-500 text-white p-2 rounded-full shadow-lg hover:bg-indigo-600 transition-all"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`transition-all duration-300 ease-in-out z-40
          ${isMobile ? "fixed inset-y-0 left-0" : "relative"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col h-screen
          ${isOpen ? "w-[250px]" : "w-[80px]"}
          bg-gradient-to-b from-indigo-500 to-indigo-700 shadow-lg text-white
          md:translate-x-0`}
      >
        {/* User Info */}
        <div className="p-4">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-400 shadow-lg">
              {loggedInUser.img ? (
                <img
                  src={loggedInUser.img}
                  alt={loggedInUser.name || "User"}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-blue-500"
                />
              ) : (
                <User className="h-8 w-8 text-white" />
              )}
            </div>
            {isOpen && (
              <div className="space-y-1">
                <h2 className="text-lg font-medium">
                  {loggedInUser.name || "Guest"}
                </h2>
                <p className="text-sm text-white flex items-center gap-2">
                  <CoinsIcon />
                  {loggedInUser.tokens && loggedInUser.tokens.length > 0
                    ? loggedInUser.tokens[0].quantity
                    : "No Tokens"}
                </p>
              </div>
            )}
          </div>
        </div>



        {/* Navigation Menu */}
        <div className="flex-1 p-4">
          <nav>
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center ${isOpen ? "justify-start" : "justify-center"}
                  w-full px-3 py-3 mb-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md`}
              >
                <item.icon className="h-5 w-5 text-white" />
                {isOpen && <span className="ml-4 font-medium">{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4">
          <Link to="/" className="block">
            <button
              className={`w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg flex items-center justify-center transition-all ${!isOpen && "justify-center"
                }`}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {isOpen && <span className="ml-2">Log out</span>}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;