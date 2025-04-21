import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "./Navbar";
import { Outlet, Navigate, useLocation } from "react-router-dom";

interface LayoutProps {
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ requireAuth = false }) => {
  const { user, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Log useful debugging information
    console.log("Layout rendering. Path:", location.pathname);
    console.log("User:", user);
    console.log("Is admin:", isAdmin);
    console.log("Is loading:", isLoading);
    console.log("Require auth:", requireAuth);
  }, [user, isLoading, isAdmin, location.pathname, requireAuth]);

  // If authentication is required and user is not logged in, redirect to login
  if (requireAuth && !user && !isLoading) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If trying to access admin page and not admin, redirect to home
  if (location.pathname === "/admin" && user && !isAdmin && !isLoading) {
    console.log("Redirecting from admin page - not an admin");
    return <Navigate to="/" replace />;
  }

  // If user is already logged in and trying to access login/register, redirect to home
  if (
    user &&
    !requireAuth &&
    (location.pathname === "/login" || location.pathname === "/register")
  ) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <Outlet />
      </main>
      <footer className="py-6 bg-mitwpu-navy text-white text-center">
        <div className="container mx-auto">
          <p className="text-sm">
            © {new Date().getFullYear()} MIT-WPU Find It Now. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
